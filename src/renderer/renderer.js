const api = window.openClashWidget;

const i18n = {
  zh: {
    eyebrow: 'OPENCLASH 控制台',
    activeCore: '当前核心',
    liveConn: '实时连接',
    upload: '上传',
    download: '下载',
    routeProbes: '线路探测',
    session: '当前会话',
    controller: '控制端',
    groupTotal: '策略组',
    activeNode: '当前节点',
    proxyGroups: '代理策略组',
    search: '搜索策略组或节点',
    delaySort: '延迟排序',
    preferences: '偏好设置',
    settingsTitle: '控制台设置',
    settingsDesc: '调整连接信息、界面风格和启动行为。',
    appearance: '外观',
    appearanceHint: '默认中文显示，可切换双主题。',
    themeGlass: '液态玻璃',
    themeGlassDesc: '透明、柔光、苹果风',
    themeMono: '深色极简',
    themeMonoDesc: '近黑、冷蓝、低亮玻璃',
    controllerHint: '这些信息来自 OpenClash / Mihomo API。',
    guideTitle: '如何找到控制面板地址和密钥',
    guideIntro: '进入 OpenClash 的运行状态页，右侧“控制面板”卡片里可以复制地址和密钥。',
    guideStep1: '打开 OpenWrt / 路由器后台，进入 Services → OpenClash。',
    guideStep2: '切到“运行状态”，找到右侧的“控制面板”。',
    guideStep3: '复制绿色地址，例如 192.168.9.1:9090，填入路由 IP 和 API 端口。',
    guideStep4: '点锁形按钮复制密钥，粘贴到 Secret。也可以直接粘贴 Bearer 文本，应用会自动识别。',
    routerIp: '路由 IP',
    apiPort: 'API 端口',
    launchAtLogin: '开机自启',
    save: '保存',
    updates: '软件更新',
    updatesHint: '启动后自动检查，发现新版本会后台下载。',
    updateIdle: '当前已是最新版本',
    updateChecking: '正在检查更新',
    updateAvailable: '发现新版本，正在下载',
    updateDownloading: '正在下载更新',
    updateDownloaded: '更新已下载，重启后安装',
    updateDev: '开发模式不检查更新',
    updateError: '更新检查失败',
    checkUpdate: '检查更新',
    installUpdate: '重启安装',
    openRelease: '下载页面',
    online: '在线',
    offline: '离线',
    unknown: '未知',
    noMatch: '没有匹配的策略组',
    test: '测速',
    healthGood: '健康',
    healthPoor: '异常',
    connected: '已连接',
    cannotReach: '无法连接',
    closeHint: '关闭按钮会隐藏到托盘。',
    secretHint: '如果是 401，请检查 Secret；如果超时，请检查控制端口。'
  },
  en: {
    eyebrow: 'OPENCLASH CONTROL DECK',
    activeCore: 'Active Core',
    liveConn: 'Live Conn',
    upload: 'Upload',
    download: 'Download',
    routeProbes: 'Route Probes',
    session: 'Current Session',
    controller: 'Controller',
    groupTotal: 'Proxy Groups',
    activeNode: 'Active Node',
    proxyGroups: 'Proxy Groups',
    search: 'Search group or node',
    delaySort: 'Delay Sort',
    preferences: 'Preferences',
    settingsTitle: 'Console Settings',
    settingsDesc: 'Tune connection details, appearance, and startup behavior.',
    appearance: 'Appearance',
    appearanceHint: 'Chinese by default, with two visual themes.',
    themeGlass: 'Liquid Glass',
    themeGlassDesc: 'Translucent, soft, Apple-like',
    themeMono: 'Dark Minimal',
    themeMonoDesc: 'Near-black, blue, dim glass',
    controllerHint: 'These values come from the OpenClash / Mihomo API.',
    guideTitle: 'Where to find endpoint and secret',
    guideIntro: 'Open the OpenClash status page. The Control Panel card on the right has copy buttons for endpoint and secret.',
    guideStep1: 'Open the OpenWrt / router admin page, then Services → OpenClash.',
    guideStep2: 'Go to Status and find the Control Panel card on the right.',
    guideStep3: 'Copy the green endpoint, such as 192.168.9.1:9090, into Router IP and API Port.',
    guideStep4: 'Use the lock button to copy the secret, then paste it into Secret. Bearer text is parsed automatically.',
    routerIp: 'Router IP',
    apiPort: 'API Port',
    launchAtLogin: 'Launch at login',
    save: 'Save',
    updates: 'Updates',
    updatesHint: 'Checks on startup and downloads new releases in the background.',
    updateIdle: 'You are up to date',
    updateChecking: 'Checking for updates',
    updateAvailable: 'Update found, downloading',
    updateDownloading: 'Downloading update',
    updateDownloaded: 'Update downloaded, restart to install',
    updateDev: 'Updates are disabled in development',
    updateError: 'Update check failed',
    checkUpdate: 'Check',
    installUpdate: 'Restart',
    openRelease: 'Releases',
    online: 'ONLINE',
    offline: 'OFFLINE',
    unknown: 'UNKNOWN',
    noMatch: 'No matching proxy group',
    test: 'TEST',
    healthGood: 'Healthy',
    healthPoor: 'Issue',
    connected: 'Connected to',
    cannotReach: 'Cannot reach',
    closeHint: 'Close button hides to tray.',
    secretHint: 'For 401, check Secret. For timeout, check the controller port.'
  }
};

const els = {
  apiStatus: document.querySelector('#apiStatus'),
  coreStatus: document.querySelector('#coreStatus'),
  connStatus: document.querySelector('#connStatus'),
  uploadSpeed: document.querySelector('#uploadSpeed'),
  downloadSpeed: document.querySelector('#downloadSpeed'),
  uploadWave: document.querySelector('#uploadWave'),
  downloadWave: document.querySelector('#downloadWave'),
  probes: document.querySelector('#probes'),
  probeSummary: document.querySelector('#probeSummary'),
  groups: document.querySelector('#groups'),
  groupCount: document.querySelector('#groupCount'),
  groupSearch: document.querySelector('#groupSearch'),
  sortDelayBtn: document.querySelector('#sortDelayBtn'),
  updatedAt: document.querySelector('#updatedAt'),
  settings: document.querySelector('#settings'),
  hostInput: document.querySelector('#hostInput'),
  portInput: document.querySelector('#portInput'),
  secretInput: document.querySelector('#secretInput'),
  launchInput: document.querySelector('#launchInput'),
  apiHint: document.querySelector('#apiHint'),
  healthText: document.querySelector('#healthText'),
  controllerText: document.querySelector('#controllerText'),
  activeNodeText: document.querySelector('#activeNodeText'),
  updateTitle: document.querySelector('#updateTitle'),
  updateDetail: document.querySelector('#updateDetail'),
  updateProgress: document.querySelector('#updateProgress'),
  checkUpdateBtn: document.querySelector('#checkUpdateBtn'),
  installUpdateBtn: document.querySelector('#installUpdateBtn'),
  openReleaseBtn: document.querySelector('#openReleaseBtn')
};

let previousTraffic = null;
let refreshTimer = null;
let currentGroups = [];
let lastSnapshot = null;
let uiPrefs = JSON.parse(localStorage.getItem('uiPrefs') || '{"lang":"zh","theme":"glass"}');
let sortByDelay = localStorage.getItem('sortByDelay') === 'true';
let delayMap = JSON.parse(localStorage.getItem('delayMap') || '{}');
let uploadSamples = Array(24).fill(0);
let downloadSamples = Array(24).fill(0);

function t(key) {
  return i18n[uiPrefs.lang]?.[key] || i18n.zh[key] || key;
}

function setText(element, value, className) {
  element.textContent = value;
  element.className = className || '';
}

function savePrefs() {
  localStorage.setItem('uiPrefs', JSON.stringify(uiPrefs));
}

function applyTheme() {
  document.body.classList.toggle('theme-glass', uiPrefs.theme === 'glass');
  document.body.classList.toggle('theme-mono', uiPrefs.theme === 'mono');
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.classList.toggle('active', button.dataset.themeChoice === uiPrefs.theme);
  });
}

function applyLanguage() {
  document.documentElement.lang = uiPrefs.lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll('[data-lang-choice]').forEach((button) => {
    button.classList.toggle('active', button.dataset.langChoice === uiPrefs.lang);
  });
  if (lastSnapshot) {
    renderSnapshot(lastSnapshot);
  } else {
    renderGroups();
  }
}

function formatBytes(bytesPerSecond) {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return '0 KB/s';
  }

  const units = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
  let value = bytesPerSecond;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

function renderWave(svg, samples) {
  const max = Math.max(...samples, 1);
  const points = samples.map((sample, index) => {
    const x = (index / (samples.length - 1)) * 180;
    const y = 36 - (sample / max) * 28;
    return [x, y];
  });
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L 180 42 L 0 42 Z`;

  svg.innerHTML = `
    <path class="wave-area" d="${area}"></path>
    <path class="wave-line" d="${line}"></path>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function normalizeSecret(value) {
  const raw = value.trim();
  const bearer = raw.match(/bearer\s+([^\s"']+)/i);
  if (bearer) {
    return bearer[1].trim();
  }

  const header = raw.match(/authorization\s*:\s*([^\r\n]+)/i);
  if (header) {
    return normalizeSecret(header[1]);
  }

  return raw.replace(/^["']|["']$/g, '');
}

function delayLabel(node) {
  const value = delayMap[node];
  if (value === undefined) {
    return '';
  }
  if (!Number.isFinite(value)) {
    return 'FAIL';
  }
  return `${value}ms`;
}

function delayClass(node) {
  const value = delayMap[node];
  if (value === undefined) {
    return '';
  }
  if (!Number.isFinite(value) || value > 1200) {
    return ' bad';
  }
  if (value > 420) {
    return ' warn';
  }
  return ' ok';
}

function renderUpdateStatus(status = {}) {
  const stateKey = {
    idle: 'updateIdle',
    checking: 'updateChecking',
    available: 'updateAvailable',
    downloading: 'updateDownloading',
    downloaded: 'updateDownloaded',
    'not-available': 'updateIdle',
    dev: 'updateDev',
    error: 'updateError'
  }[status.state] || 'updateIdle';

  els.updateTitle.textContent = t(stateKey);
  els.updateTitle.className = status.state === 'error' ? 'bad' : status.state === 'downloaded' ? 'ok' : '';
  els.installUpdateBtn.classList.toggle('hidden', status.state !== 'downloaded');
  els.checkUpdateBtn.disabled = ['checking', 'downloading'].includes(status.state);

  const version = status.info?.version ? `v${status.info.version}` : '';
  const error = status.error ? ` · ${status.error}` : '';
  const percent = Number(status.progress?.percent || 0);
  const progressText = status.state === 'downloading' && percent ? ` · ${percent.toFixed(0)}%` : '';
  els.updateDetail.textContent = `${version || 'v--'}${progressText}${error}`;

  els.updateProgress.classList.toggle('hidden', status.state !== 'downloading');
  els.updateProgress.querySelector('span').style.width = `${Math.min(Math.max(percent, 0), 100)}%`;
}

function updateTraffic(connections) {
  const upload = Number(connections?.uploadTotal || 0);
  const download = Number(connections?.downloadTotal || 0);
  const now = Date.now();

  if (!previousTraffic) {
    previousTraffic = { upload, download, now };
    return;
  }

  const seconds = Math.max((now - previousTraffic.now) / 1000, 1);
  const uploadRate = Math.max((upload - previousTraffic.upload) / seconds, 0);
  const downloadRate = Math.max((download - previousTraffic.download) / seconds, 0);
  els.uploadSpeed.textContent = formatBytes(uploadRate);
  els.downloadSpeed.textContent = formatBytes(downloadRate);
  uploadSamples = [...uploadSamples.slice(1), uploadRate];
  downloadSamples = [...downloadSamples.slice(1), downloadRate];
  renderWave(els.uploadWave, uploadSamples);
  renderWave(els.downloadWave, downloadSamples);
  previousTraffic = { upload, download, now };
}

function renderProbes(probes) {
  els.probes.innerHTML = '';
  const okCount = probes.filter((probe) => probe.ok).length;
  els.probeSummary.textContent = `${okCount}/${probes.length}`;
  setText(els.healthText, okCount === probes.length ? t('healthGood') : t('healthPoor'), okCount === probes.length ? 'ok' : 'warn');

  for (const probe of probes) {
    const item = document.createElement('div');
    item.className = 'probe';
    const icon = serviceIcon(probe.name);
    item.innerHTML = `
      <span>${icon}<span>${escapeHtml(probe.name)}</span></span>
      <strong class="${probe.ok ? 'ok' : 'bad'}">${probe.ok ? `${probe.ms} ms` : 'FAIL'}</strong>
    `;
    els.probes.appendChild(item);
  }
}

function serviceIcon(name) {
  const key = name.toLowerCase();
  if (key.includes('google')) {
    return '<span class="service-icon"><img src="../assets/service-icons/谷歌.svg" alt="Google" /></span>';
  }
  if (key.includes('github')) {
    return '<span class="service-icon"><img src="../assets/service-icons/github.svg" alt="GitHub" /></span>';
  }
  if (key.includes('chatgpt')) {
    return '<span class="service-icon"><img src="../assets/service-icons/chatgpt.svg" alt="ChatGPT" /></span>';
  }
  if (key.includes('baidu')) {
    return '<span class="service-icon"><img src="../assets/service-icons/百度.svg" alt="Baidu" /></span>';
  }
  if (key.includes('youtube')) {
    return '<span class="service-icon"><img src="../assets/service-icons/youtube.svg" alt="YouTube" /></span>';
  }
  if (key.includes('claude')) {
    return '<span class="service-icon"><img src="../assets/service-icons/claude code.svg" alt="Claude" /></span>';
  }
  return '<span class="service-icon">•</span>';
}

function groupMatches(group, query) {
  if (!query) {
    return true;
  }

  const haystack = [group.name, group.now, ...group.all].join(' ').toLowerCase();
  return haystack.includes(query);
}

function sortGroups(groups) {
  const priority = [
    'select',
    'proxy',
    'manual',
    'auto',
    'global',
    '\u9009\u62e9',
    '\u8282\u70b9',
    '\u624b\u52a8',
    '\u81ea\u52a8'
  ];

  return [...groups].sort((a, b) => {
    const score = (group) => {
      const name = group.name.toLowerCase();
      const index = priority.findIndex((word) => name.includes(word));
      return index === -1 ? 99 : index;
    };

    return score(a) - score(b) || a.name.localeCompare(b.name);
  });
}

function sortNodes(nodes, activeNode) {
  const ranked = [...nodes];

  if (sortByDelay) {
    ranked.sort((a, b) => {
      const aDelay = delayMap[a] ?? Infinity;
      const bDelay = delayMap[b] ?? Infinity;
      return aDelay - bDelay || a.localeCompare(b);
    });
  }

  if (!sortByDelay && activeNode) {
    ranked.sort((a, b) => Number(b === activeNode) - Number(a === activeNode));
  }

  return ranked;
}

function getPrimaryGroup(groups) {
  return groups.find((group) => group.name.includes('\u9009\u62e9') || group.name.toLowerCase().includes('select'))
    || groups.find((group) => group.name.toLowerCase() === 'global')
    || groups[0];
}

function renderGroups(groups = currentGroups) {
  const query = els.groupSearch.value.trim().toLowerCase();
  const visibleGroups = sortGroups(groups).filter((group) => groupMatches(group, query));
  els.groups.innerHTML = '';
  els.groupCount.textContent = `${visibleGroups.length}/${groups.length}`;
  els.sortDelayBtn.classList.toggle('active', sortByDelay);
  els.sortDelayBtn.querySelector('span').textContent = t('delaySort');

  if (!visibleGroups.length) {
    els.groups.innerHTML = `<div class="empty-state">${t('noMatch')}</div>`;
    return;
  }

  for (const group of visibleGroups) {
    const card = document.createElement('article');
    card.className = 'group';

    const nodes = sortNodes(group.all, group.now).map((node) => {
      const active = node === group.now ? ' active' : '';
      const safeNode = escapeHtml(node);
      const safeDelay = delayLabel(node);
      return `
        <button class="node${active}" data-group="${encodeURIComponent(group.name)}" data-node="${encodeURIComponent(node)}" title="${safeNode}">
          <span class="node-name">${safeNode}</span>
          <span class="delay${delayClass(node)}">${safeDelay}</span>
        </button>
      `;
    }).join('');

    card.innerHTML = `
      <div class="group-title">
        <div class="group-name">
          <strong title="${escapeHtml(group.name)}">${escapeHtml(group.name)}</strong>
          <span title="${escapeHtml(group.now || '')}">${escapeHtml(group.now || group.type)}</span>
        </div>
        <button class="test-btn" data-group="${encodeURIComponent(group.name)}" title="Test latency">
          <svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 10-13h-7l1-7Z"/></svg>
        </button>
      </div>
      <div class="nodes">${nodes}</div>
    `;
    els.groups.appendChild(card);
  }

  els.groups.querySelectorAll('.node').forEach((button) => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      await api.switchProxy({
        group: decodeURIComponent(button.dataset.group),
        node: decodeURIComponent(button.dataset.node)
      });
      await refresh();
    });
  });

  els.groups.querySelectorAll('.test-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const icon = button.innerHTML;
      button.innerHTML = '<span class="testing-dot"></span>';
      button.disabled = true;
      try {
        const group = decodeURIComponent(button.dataset.group);
        delayMap = { ...delayMap, ...(await api.testDelay({ group })) };
        localStorage.setItem('delayMap', JSON.stringify(delayMap));
        renderGroups();
      } finally {
        button.innerHTML = icon;
        button.disabled = false;
      }
    });
  });
}

function renderSnapshot(snapshot) {
  lastSnapshot = snapshot;
  currentGroups = snapshot.groups || [];
  const primaryGroup = getPrimaryGroup(currentGroups);

  setText(els.apiStatus, snapshot.api.ok ? t('online') : t('offline'), `status-pill ${snapshot.api.ok ? 'ok' : 'bad'}`);
  setText(els.coreStatus, snapshot.version?.version || t('unknown'), snapshot.api.ok ? 'ok' : 'warn');
  setText(els.connStatus, String(snapshot.connections?.connections?.length ?? 0), snapshot.api.ok ? '' : 'warn');
  els.updatedAt.textContent = new Date(snapshot.updatedAt).toLocaleTimeString();
  els.controllerText.textContent = snapshot.api.base || '--';
  els.activeNodeText.textContent = primaryGroup?.now || '--';
  els.apiHint.textContent = snapshot.api.ok
    ? `${t('connected')} ${snapshot.api.base}. ${t('closeHint')}`
    : `${t('cannotReach')} ${snapshot.api.base}. ${t('secretHint')}`;

  updateTraffic(snapshot.connections);
  renderProbes(snapshot.probes || []);
  renderGroups();
}

async function refresh() {
  try {
    const snapshot = await api.getSnapshot();
    renderSnapshot(snapshot);
  } catch (error) {
    setText(els.apiStatus, 'ERROR', 'status-pill bad');
    els.apiHint.textContent = error.message;
  }
}

async function loadSettings() {
  const config = await api.getConfig();
  els.hostInput.value = config.host;
  els.portInput.value = config.port;
  els.secretInput.value = config.secret || '';
  els.launchInput.checked = Boolean(config.launchAtLogin);
}

document.querySelector('#refreshBtn').addEventListener('click', refresh);
document.querySelector('#settingsBtn').addEventListener('click', () => {
  els.settings.classList.toggle('hidden');
});
document.querySelector('#minBtn').addEventListener('click', () => api.minimize());
document.querySelector('#maxBtn').addEventListener('click', async () => {
  setMaximizedState(await api.toggleMaximize());
});
document.querySelector('#closeBtn').addEventListener('click', () => api.close());
document.querySelector('.titlebar').addEventListener('dblclick', async (event) => {
  if (event.target.closest('button, input, select, textarea')) {
    return;
  }

  setMaximizedState(await api.toggleMaximize());
});
document.querySelector('#saveSettingsBtn').addEventListener('click', async () => {
  await api.setConfig({
    host: els.hostInput.value.trim(),
    port: Number(els.portInput.value),
    secret: normalizeSecret(els.secretInput.value),
    launchAtLogin: els.launchInput.checked
  });
  previousTraffic = null;
  els.settings.classList.add('hidden');
  await refresh();
});
els.checkUpdateBtn.addEventListener('click', async () => {
  renderUpdateStatus(await api.checkForUpdates());
});
els.installUpdateBtn.addEventListener('click', () => api.installUpdate());
els.openReleaseBtn.addEventListener('click', () => api.openReleases());
els.groupSearch.addEventListener('input', () => renderGroups());
els.sortDelayBtn.addEventListener('click', () => {
  sortByDelay = !sortByDelay;
  localStorage.setItem('sortByDelay', String(sortByDelay));
  renderGroups();
});
document.querySelectorAll('[data-theme-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    uiPrefs.theme = button.dataset.themeChoice;
    savePrefs();
    applyTheme();
  });
});
document.querySelectorAll('[data-lang-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    uiPrefs.lang = button.dataset.langChoice;
    savePrefs();
    applyLanguage();
  });
});

function setMaximizedState(isMaximized) {
  document.body.classList.toggle('is-maximized', Boolean(isMaximized));
  const button = document.querySelector('#maxBtn');
  if (button) {
    button.title = isMaximized ? 'Restore' : 'Maximize';
    button.setAttribute('aria-label', button.title);
  }
}

api.onMaximizedChange?.(setMaximizedState);
api.getMaximized?.().then(setMaximizedState).catch(() => {});
api.onUpdateStatus?.(renderUpdateStatus);
api.getUpdateStatus?.().then(renderUpdateStatus).catch(() => {});

applyTheme();
applyLanguage();
loadSettings();
refresh();
refreshTimer = setInterval(refresh, 5000);
window.addEventListener('beforeunload', () => clearInterval(refreshTimer));
