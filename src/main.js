const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('node:path');
const fs = require('node:fs/promises');

const DEFAULT_CONFIG = {
  host: '192.168.9.1',
  port: 9090,
  secret: '',
  subscriptionUrl: '',
  launchAtLogin: false,
  windowBounds: {
    width: 1120,
    height: 610
  },
  probeUrls: [
    { name: 'Google', url: 'https://www.gstatic.com/generate_204' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'ChatGPT', url: 'https://chatgpt.com/cdn-cgi/trace', proxyProbe: true },
    { name: 'Baidu', url: 'https://www.baidu.com' },
    { name: 'YouTube', url: 'https://www.youtube.com/generate_204', proxyProbe: true },
    { name: 'Claude', url: 'https://claude.ai', proxyProbe: true }
  ]
};

let mainWindow;
let tray;
let saveWindowTimer;
let updateStatus = {
  state: 'idle',
  message: '',
  info: null,
  progress: null,
  error: null
};

function configPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

async function readConfig() {
  try {
    const raw = await fs.readFile(configPath(), 'utf8');
    const config = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    config.probeUrls = mergeProbeUrls(config.probeUrls);
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
}

function mergeProbeUrls(savedProbes = []) {
  const savedByName = new Map(savedProbes.map((probe) => [probe.name, probe]));

  return [
    ...DEFAULT_CONFIG.probeUrls.map((defaultProbe) => ({
      ...defaultProbe,
      ...(savedByName.get(defaultProbe.name) || {}),
      url: defaultProbe.url,
      proxyProbe: defaultProbe.proxyProbe
    })),
    ...savedProbes.filter((probe) => !DEFAULT_CONFIG.probeUrls.some((defaultProbe) => defaultProbe.name === probe.name))
  ];
}

async function writeConfig(config) {
  const safeConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    port: Number(config.port || DEFAULT_CONFIG.port),
    launchAtLogin: Boolean(config.launchAtLogin)
  };
  await fs.mkdir(app.getPath('userData'), { recursive: true });
  await fs.writeFile(configPath(), JSON.stringify(safeConfig, null, 2));
  app.setLoginItemSettings({
    openAtLogin: safeConfig.launchAtLogin,
    path: process.execPath
  });
  return safeConfig;
}

function controllerBase(config) {
  return `http://${config.host}:${config.port}`;
}

async function requestJson(config, apiPath, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || 3500);
  const headers = {
    ...(options.headers || {})
  };

  if (config.secret) {
    headers.Authorization = `Bearer ${config.secret}`;
  }

  try {
    const response = await fetch(`${controllerBase(config)}${apiPath}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeGroups(proxiesPayload) {
  const proxies = proxiesPayload?.proxies || {};
  return Object.entries(proxies)
    .filter(([, proxy]) => Array.isArray(proxy.all) && proxy.all.length > 0)
    .map(([name, proxy]) => ({
      name,
      type: proxy.type,
      now: proxy.now,
      all: proxy.all,
      history: proxy.history || []
    }))
    .sort((a, b) => {
      const weight = (group) => (group.name === 'GLOBAL' ? -1 : group.type === 'Selector' ? 0 : 1);
      return weight(a) - weight(b) || a.name.localeCompare(b.name);
    });
}

function normalizeSubscriptionUsage(providersPayload) {
  const providers = providersPayload?.providers || {};
  const subscriptions = Object.entries(providers)
    .map(([name, provider]) => {
      const info = provider?.subscriptionInfo || provider?.subscription_info || provider?.['subscription-info'];
      if (!info) {
        return null;
      }

      const upload = Number(info.upload || 0);
      const download = Number(info.download || 0);
      const total = Number(info.total || 0);
      const expireRaw = Number(info.expire || 0);
      const expireAt = expireRaw > 0
        ? new Date(expireRaw > 1e12 ? expireRaw : expireRaw * 1000).toISOString()
        : null;

      return {
        name,
        upload,
        download,
        used: upload + download,
        total,
        expireAt
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));

  return {
    available: subscriptions.length > 0,
    count: subscriptions.length,
    primary: subscriptions[0] || null,
    subscriptions
  };
}

function parseSubscriptionUserInfo(value, name = 'Subscription') {
  if (!value) {
    return null;
  }

  const fields = Object.fromEntries(
    value.split(';')
      .map((part) => part.trim().split('='))
      .filter(([key, fieldValue]) => key && fieldValue !== undefined)
      .map(([key, fieldValue]) => [key.toLowerCase(), Number(fieldValue)])
  );
  const upload = Number(fields.upload || 0);
  const download = Number(fields.download || 0);
  const total = Number(fields.total || 0);
  const expireRaw = Number(fields.expire || 0);

  if (!total && !upload && !download && !expireRaw) {
    return null;
  }

  return {
    name,
    upload,
    download,
    used: upload + download,
    total,
    expireAt: expireRaw > 0 ? new Date(expireRaw > 1e12 ? expireRaw : expireRaw * 1000).toISOString() : null
  };
}

async function fetchSubscriptionUsage(config) {
  if (!config.subscriptionUrl) {
    return null;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  const commonHeaders = {
    'User-Agent': 'clash.meta',
    Accept: '*/*'
  };
  const request = async (method, headers = {}) => fetch(config.subscriptionUrl, {
    method,
    headers: { ...commonHeaders, ...headers },
    redirect: 'follow',
    signal: controller.signal
  });

  try {
    let response = await request('HEAD');
    let userInfo = response.headers.get('subscription-userinfo');
    if (!userInfo) {
      response = await request('GET', { Range: 'bytes=0-0' });
      userInfo = response.headers.get('subscription-userinfo');
    }
    let name = 'Subscription URL';
    try {
      name = new URL(config.subscriptionUrl).hostname;
    } catch {}
    return parseSubscriptionUserInfo(userInfo, name);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function probeUrl(probe) {
  const startedAt = performance.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(probe.url, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal
    });
    return {
      name: probe.name,
      ok: response.status < 500,
      ms: Math.round(performance.now() - startedAt)
    };
  } catch (error) {
    return {
      name: probe.name,
      ok: false,
      ms: null,
      error: error.name === 'AbortError' ? 'timeout' : 'failed'
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getPrimaryGroup(groups) {
  return groups.find((group) => group.name.includes('选择') || group.name.toLowerCase().includes('select'))
    || groups.find((group) => group.name.toLowerCase() === 'global')
    || groups[0];
}

async function probeUrlViaProxy(config, probe, proxyName) {
  if (!proxyName || ['DIRECT', 'REJECT'].includes(proxyName.toUpperCase())) {
    return probeUrl(probe);
  }

  const startedAt = performance.now();
  const apiPath = `/proxies/${encodeURIComponent(proxyName)}/delay?timeout=5000&url=${encodeURIComponent(probe.url)}`;

  try {
    const payload = await requestJson(config, apiPath, { timeout: 6500 });
    return {
      name: probe.name,
      ok: Number.isFinite(Number(payload?.delay)),
      ms: Number(payload?.delay ?? Math.round(performance.now() - startedAt))
    };
  } catch (error) {
    return {
      name: probe.name,
      ok: false,
      ms: null,
      error: error.name === 'AbortError' ? 'timeout' : 'failed'
    };
  }
}

function probeUrls(config, groups = []) {
  const primaryGroup = getPrimaryGroup(groups);
  const activeProxy = primaryGroup?.now;

  return Promise.all(config.probeUrls.map((probe) => (
    probe.proxyProbe ? probeUrlViaProxy(config, probe, activeProxy) : probeUrl(probe)
  )));
}

async function getSnapshot() {
  const config = await readConfig();
  const snapshot = {
    config,
    api: { ok: false, base: controllerBase(config) },
    version: null,
    groups: [],
    connections: null,
    probes: [],
    subscriptionUsage: { available: false, count: 0, primary: null, subscriptions: [] },
    updatedAt: new Date().toISOString()
  };

  try {
    const [version, proxies, connections, providers, fallbackSubscription] = await Promise.all([
      requestJson(config, '/version'),
      requestJson(config, '/proxies'),
      requestJson(config, '/connections').catch(() => null),
      requestJson(config, '/providers/proxies').catch(() => null),
      fetchSubscriptionUsage(config)
    ]);
    const groups = normalizeGroups(proxies);

    snapshot.api.ok = true;
    snapshot.version = version;
    snapshot.groups = groups;
    snapshot.connections = connections;
    snapshot.subscriptionUsage = normalizeSubscriptionUsage(providers);
    if (!snapshot.subscriptionUsage.available && fallbackSubscription) {
      snapshot.subscriptionUsage = {
        available: true,
        count: 1,
        primary: fallbackSubscription,
        subscriptions: [fallbackSubscription]
      };
    }
    snapshot.probes = await probeUrls(config, groups);
  } catch (error) {
    snapshot.api = {
      ok: false,
      base: controllerBase(config),
      status: error.status,
      message: error.message
    };
    snapshot.probes = await probeUrls(config);
  }

  return snapshot;
}

async function switchProxy(_, { group, node }) {
  const config = await readConfig();
  await requestJson(config, `/proxies/${encodeURIComponent(group)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: node }),
    timeout: 5000
  });
  return getSnapshot();
}

async function testGroupDelay(_, { group }) {
  const config = await readConfig();
  const proxies = await requestJson(config, '/proxies');
  const proxyGroup = proxies?.proxies?.[group];
  const nodes = Array.isArray(proxyGroup?.all) ? proxyGroup.all : [];
  const url = encodeURIComponent('https://www.gstatic.com/generate_204');
  const results = {};
  const queue = [...nodes];
  const workers = Array.from({ length: Math.min(8, queue.length) }, async () => {
    while (queue.length) {
      const node = queue.shift();
      try {
        const payload = await requestJson(config, `/proxies/${encodeURIComponent(node)}/delay?timeout=5000&url=${url}`, {
          timeout: 6500
        });
        results[node] = Number(payload?.delay ?? Infinity);
      } catch {
        results[node] = Infinity;
      }
    }
  });

  await Promise.all(workers);
  return results;
}

function makeTrayImage() {
  const iconPath = path.join(__dirname, 'assets', 'logo.png');
  return nativeImage.createFromPath(iconPath);
}

function createTray() {
  if (tray) {
    return;
  }

  tray = new Tray(makeTrayImage());
  tray.setToolTip('OpenClash Network Pulse');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show Widget',
      click: () => {
        mainWindow?.show();
        mainWindow?.focus();
      }
    },
    {
      label: 'Hide Widget',
      click: () => mainWindow?.hide()
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]));
  tray.on('double-click', () => {
    if (mainWindow?.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow?.show();
      mainWindow?.focus();
    }
  });
}

function sendUpdateStatus(patch) {
  updateStatus = {
    ...updateStatus,
    ...patch,
    updatedAt: new Date().toISOString()
  };

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('update:status', updateStatus);
  }

  return updateStatus;
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on('checking-for-update', () => {
    sendUpdateStatus({ state: 'checking', message: 'checking', error: null, progress: null });
  });
  autoUpdater.on('update-available', (info) => {
    sendUpdateStatus({ state: 'available', message: 'available', info, error: null, progress: null });
  });
  autoUpdater.on('download-progress', (progress) => {
    sendUpdateStatus({ state: 'downloading', message: 'downloading', progress });
  });
  autoUpdater.on('update-downloaded', (info) => {
    sendUpdateStatus({ state: 'downloaded', message: 'downloaded', info, progress: null });
  });
  autoUpdater.on('update-not-available', (info) => {
    sendUpdateStatus({ state: 'not-available', message: 'not-available', info, progress: null });
  });
  autoUpdater.on('error', (error) => {
    sendUpdateStatus({
      state: 'error',
      message: 'error',
      error: error?.message || String(error),
      progress: null
    });
  });
}

async function checkForUpdates() {
  if (!app.isPackaged) {
    return sendUpdateStatus({
      state: 'dev',
      message: 'dev',
      info: { version: app.getVersion() },
      progress: null,
      error: null
    });
  }

  try {
    await autoUpdater.checkForUpdates();
    return updateStatus;
  } catch (error) {
    return sendUpdateStatus({
      state: 'error',
      message: 'error',
      error: error?.message || String(error),
      progress: null
    });
  }
}

function installUpdate() {
  if (updateStatus.state !== 'downloaded') {
    return false;
  }

  app.isQuitting = true;
  autoUpdater.quitAndInstall(false, true);
  return true;
}

async function persistWindowBounds() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const config = await readConfig();
  await writeConfig({
    ...config,
    windowBounds: mainWindow.getBounds()
  });
}

function queueWindowBoundsSave() {
  clearTimeout(saveWindowTimer);
  saveWindowTimer = setTimeout(() => {
    persistWindowBounds().catch(() => {});
  }, 600);
}

function broadcastMaximizedState() {
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  mainWindow.webContents.send('window:maximized-change', mainWindow.isMaximized());
}

async function createWindow() {
  const config = await readConfig();
  const bounds = config.windowBounds || DEFAULT_CONFIG.windowBounds;
  mainWindow = new BrowserWindow({
    width: Math.max(bounds.width || DEFAULT_CONFIG.windowBounds.width, 1060),
    height: Math.min(Math.max(bounds.height || DEFAULT_CONFIG.windowBounds.height, 560), 610),
    x: bounds.x,
    y: bounds.y,
    minWidth: 760,
    minHeight: 560,
    frame: false,
    thickFrame: true,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    maximizable: true,
    minimizable: true,
    skipTaskbar: false,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, 'assets', 'logo.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on('move', queueWindowBoundsSave);
  mainWindow.on('resize', queueWindowBoundsSave);
  mainWindow.on('maximize', broadcastMaximizedState);
  mainWindow.on('unmaximize', broadcastMaximizedState);
  mainWindow.on('enter-full-screen', broadcastMaximizedState);
  mainWindow.on('leave-full-screen', broadcastMaximizedState);
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  setupAutoUpdater();
  readConfig().then((config) => writeConfig(config)).catch(() => {});
  ipcMain.handle('config:get', readConfig);
  ipcMain.handle('config:set', (_, config) => writeConfig(config));
  ipcMain.handle('snapshot:get', getSnapshot);
  ipcMain.handle('proxy:switch', switchProxy);
  ipcMain.handle('proxy:testDelay', testGroupDelay);
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:toggleMaximize', () => {
    if (!mainWindow) {
      return false;
    }

    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }

    broadcastMaximizedState();
    return mainWindow.isMaximized();
  });
  ipcMain.handle('window:isMaximized', () => Boolean(mainWindow?.isMaximized()));
  ipcMain.handle('window:close', () => mainWindow?.hide());
  ipcMain.handle('update:check', checkForUpdates);
  ipcMain.handle('update:status', () => updateStatus);
  ipcMain.handle('update:install', installUpdate);
  ipcMain.handle('update:openReleases', () => {
    shell.openExternal('https://github.com/bxq9200/openclash-network-pulse/releases/latest');
  });

  createTray();
  createWindow();
  setTimeout(() => {
    checkForUpdates().catch(() => {});
  }, 6000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
