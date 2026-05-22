const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const DEFAULT_CONFIG = {
  host: '192.168.9.1',
  port: 9090,
  secret: '',
  launchAtLogin: false,
  windowBounds: {
    width: 1120,
    height: 610
  },
  probeUrls: [
    { name: 'Google', url: 'https://www.gstatic.com/generate_204' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'ChatGPT', url: 'https://chat.openai.com' },
    { name: 'Baidu', url: 'https://www.baidu.com' },
    { name: 'YouTube', url: 'https://www.youtube.com/generate_204' },
    { name: 'Claude', url: 'https://claude.ai' }
  ]
};

let mainWindow;
let tray;
let saveWindowTimer;

function configPath() {
  return path.join(app.getPath('userData'), 'config.json');
}

async function readConfig() {
  try {
    const raw = await fs.readFile(configPath(), 'utf8');
    const config = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    const existingProbeNames = new Set((config.probeUrls || []).map((probe) => probe.name));
    config.probeUrls = [
      ...(config.probeUrls || []),
      ...DEFAULT_CONFIG.probeUrls.filter((probe) => !existingProbeNames.has(probe.name))
    ];
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
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

async function getSnapshot() {
  const config = await readConfig();
  const snapshot = {
    config,
    api: { ok: false, base: controllerBase(config) },
    version: null,
    groups: [],
    connections: null,
    probes: [],
    updatedAt: new Date().toISOString()
  };

  try {
    const [version, proxies, connections, probes] = await Promise.all([
      requestJson(config, '/version'),
      requestJson(config, '/proxies'),
      requestJson(config, '/connections').catch(() => null),
      Promise.all(config.probeUrls.map(probeUrl))
    ]);

    snapshot.api.ok = true;
    snapshot.version = version;
    snapshot.groups = normalizeGroups(proxies);
    snapshot.connections = connections;
    snapshot.probes = probes;
  } catch (error) {
    snapshot.api = {
      ok: false,
      base: controllerBase(config),
      status: error.status,
      message: error.message
    };
    snapshot.probes = await Promise.all(config.probeUrls.map(probeUrl));
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
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  readConfig().then((config) => writeConfig(config)).catch(() => {});
  ipcMain.handle('config:get', readConfig);
  ipcMain.handle('config:set', (_, config) => writeConfig(config));
  ipcMain.handle('snapshot:get', getSnapshot);
  ipcMain.handle('proxy:switch', switchProxy);
  ipcMain.handle('proxy:testDelay', testGroupDelay);
  ipcMain.handle('window:minimize', () => mainWindow?.minimize());
  ipcMain.handle('window:close', () => mainWindow?.hide());

  createTray();
  createWindow();

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
