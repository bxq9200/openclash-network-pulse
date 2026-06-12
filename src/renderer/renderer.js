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
    subscriptionUsage: '订阅用量',
    usedTraffic: '已用',
    remainingTraffic: '剩余',
    totalTraffic: '总量',
    expiresAt: '到期',
    daysRemaining: '天后到期',
    expired: '已到期',
    noExpiry: '未提供到期时间',
    subscriptionUnavailable: '未获取到用量，可在设置中填写订阅链接',
    subscriptionReadFailed: '订阅链接已配置，但暂时无法读取用量',
    subscriptionRefreshing: '正在读取 OpenClash 订阅用量…',
    subscriptionCredentialsMissing: '请在设置中填写路由器后台账号和密码',
    subscriptionLoginFailed: '路由器后台登录失败，请检查账号和密码',
    subscriptionRouterUnreachable: '无法连接路由器后台，请检查路由 IP',
    subscriptionConfigFailed: '无法读取 OpenClash 当前配置',
    subscriptionNoActiveConfig: 'OpenClash 未返回当前配置文件',
    subscriptionInfoFailed: 'OpenClash 用量接口调用失败',
    subscriptionNoProviderInfo: 'OpenClash 未找到订阅用量信息',
    subscriptionInvalidResponse: 'OpenClash 用量接口返回了无法识别的数据',
    subscriptionUrl: '订阅链接（用于读取用量）',
    luciUsername: '路由器后台账号',
    luciPassword: '路由器后台密码',
    luciPasswordHint: '用于调用 OpenClash 官方用量接口',
    proxyGroups: '代理策略组',
    search: '搜索策略组或节点',
    delaySort: '延迟排序',
    chooseNode: '选择节点',
    nodeSearch: '搜索节点、地区、倍率',
    allNodes: '全部',
    nodeCount: '个节点',
    selectNode: '选择',
    testSelectedGroup: '测速',
    testingNodes: '测速中',
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
    subscriptionUsage: 'Subscription Usage',
    usedTraffic: 'Used',
    remainingTraffic: 'Remaining',
    totalTraffic: 'Total',
    expiresAt: 'Expires',
    daysRemaining: 'days remaining',
    expired: 'Expired',
    noExpiry: 'No expiry provided',
    subscriptionUnavailable: 'No usage found. Add the subscription URL in Settings.',
    subscriptionReadFailed: 'Subscription URL is configured, but usage could not be read.',
    subscriptionRefreshing: 'Reading OpenClash subscription usage…',
    subscriptionCredentialsMissing: 'Add the router admin username and password in Settings.',
    subscriptionLoginFailed: 'Router admin login failed. Check the username and password.',
    subscriptionRouterUnreachable: 'Cannot reach the router admin page. Check the router IP.',
    subscriptionConfigFailed: 'Could not read the active OpenClash configuration.',
    subscriptionNoActiveConfig: 'OpenClash did not return an active configuration.',
    subscriptionInfoFailed: 'The OpenClash usage endpoint failed.',
    subscriptionNoProviderInfo: 'OpenClash did not find subscription usage information.',
    subscriptionInvalidResponse: 'OpenClash returned an unrecognized usage response.',
    subscriptionUrl: 'Subscription URL (for usage)',
    luciUsername: 'Router admin username',
    luciPassword: 'Router admin password',
    luciPasswordHint: 'Used for the official OpenClash usage endpoint',
    proxyGroups: 'Proxy Groups',
    search: 'Search group or node',
    delaySort: 'Delay Sort',
    chooseNode: 'Choose Node',
    nodeSearch: 'Search node, region, multiplier',
    allNodes: 'All',
    nodeCount: 'nodes',
    selectNode: 'Select',
    testSelectedGroup: 'Test',
    testingNodes: 'Testing',
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
  subscriptionUrlInput: document.querySelector('#subscriptionUrlInput'),
  luciUsernameInput: document.querySelector('#luciUsernameInput'),
  luciPasswordInput: document.querySelector('#luciPasswordInput'),
  launchInput: document.querySelector('#launchInput'),
  apiHint: document.querySelector('#apiHint'),
  healthText: document.querySelector('#healthText'),
  controllerText: document.querySelector('#controllerText'),
  activeNodeText: document.querySelector('#activeNodeText'),
  subscriptionName: document.querySelector('#subscriptionName'),
  subscriptionAvailable: document.querySelector('#subscriptionAvailable'),
  subscriptionUnavailable: document.querySelector('#subscriptionUnavailable'),
  subscriptionPercent: document.querySelector('#subscriptionPercent'),
  subscriptionRemaining: document.querySelector('#subscriptionRemaining'),
  subscriptionProgressBar: document.querySelector('#subscriptionProgressBar'),
  subscriptionUsed: document.querySelector('#subscriptionUsed'),
  subscriptionLeft: document.querySelector('#subscriptionLeft'),
  subscriptionTotal: document.querySelector('#subscriptionTotal'),
  subscriptionExpire: document.querySelector('#subscriptionExpire'),
  refreshSubscriptionBtn: document.querySelector('#refreshSubscriptionBtn'),
  updateTitle: document.querySelector('#updateTitle'),
  updateDetail: document.querySelector('#updateDetail'),
  updateProgress: document.querySelector('#updateProgress'),
  checkUpdateBtn: document.querySelector('#checkUpdateBtn'),
  installUpdateBtn: document.querySelector('#installUpdateBtn'),
  openReleaseBtn: document.querySelector('#openReleaseBtn'),
  nodePicker: document.querySelector('#nodePicker'),
  nodePickerTitle: document.querySelector('#nodePickerTitle'),
  nodePickerSubtitle: document.querySelector('#nodePickerSubtitle'),
  nodeSearchInput: document.querySelector('#nodeSearchInput'),
  nodeFilters: document.querySelector('#nodeFilters'),
  nodeList: document.querySelector('#nodeList'),
  testPickerBtn: document.querySelector('#testPickerBtn')
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
let pickerGroup = null;
let pickerFilter = 'all';
let testingPickerGroup = false;

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
  renderNodePicker();
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

function formatStorage(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return '--';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  const digits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toFixed(digits)} ${units[index]}`;
}

function expiryDetails(expireAt) {
  if (!expireAt) {
    return { date: '--', remaining: t('noExpiry') };
  }

  const expiry = new Date(expireAt);
  if (Number.isNaN(expiry.getTime())) {
    return { date: '--', remaining: t('noExpiry') };
  }

  const days = Math.ceil((expiry.getTime() - Date.now()) / 86400000);
  return {
    date: expiry.toLocaleDateString(),
    remaining: days > 0 ? `${days} ${t('daysRemaining')}` : t('expired')
  };
}

function subscriptionDiagnosticText(diagnostic, configured) {
  const stage = diagnostic?.stage;
  const source = diagnostic?.source;
  const suffix = diagnostic?.status ? ` (HTTP ${diagnostic.status})` : '';

  if (!configured) {
    return t('subscriptionUnavailable');
  }

  const key = {
    'credentials-missing': 'subscriptionCredentialsMissing',
    'login-failed': 'subscriptionLoginFailed',
    'router-unreachable': 'subscriptionRouterUnreachable',
    'no-active-config': 'subscriptionNoActiveConfig',
    'no-provider-info': 'subscriptionNoProviderInfo',
    'invalid-response': 'subscriptionInvalidResponse'
  }[stage];

  if (key) {
    return `${t(key)}${suffix}`;
  }
  if (stage === 'endpoint-failed') {
    return `${t(source === 'config-name' ? 'subscriptionConfigFailed' : 'subscriptionInfoFailed')}${suffix}`;
  }
  return t('subscriptionReadFailed');
}

function renderSubscriptionUsage(usage) {
  const primary = usage?.primary;
  const available = Boolean(usage?.available && primary);
  els.subscriptionAvailable.classList.toggle('hidden', !available);
  els.subscriptionUnavailable.classList.toggle('hidden', available);

  if (!available) {
    els.subscriptionName.textContent = '--';
    els.subscriptionUnavailable.textContent = subscriptionDiagnosticText(usage?.diagnostic, usage?.configured);
    els.subscriptionUnavailable.title = els.subscriptionUnavailable.textContent;
    return;
  }

  const total = Math.max(Number(primary.total || 0), 0);
  const used = Math.max(Number(primary.used || 0), 0);
  const left = Math.max(total - used, 0);
  const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const expiry = expiryDetails(primary.expireAt);
  const extraCount = Math.max(Number(usage.count || 1) - 1, 0);

  els.subscriptionName.textContent = `${primary.name}${extraCount ? ` +${extraCount}` : ''}`;
  els.subscriptionName.title = primary.name;
  els.subscriptionPercent.textContent = `${percent.toFixed(percent >= 10 ? 0 : 1)}%`;
  els.subscriptionRemaining.textContent = expiry.remaining;
  els.subscriptionProgressBar.style.width = `${percent}%`;
  els.subscriptionUsed.textContent = formatStorage(used);
  els.subscriptionLeft.textContent = formatStorage(left);
  els.subscriptionTotal.textContent = formatStorage(total);
  els.subscriptionExpire.textContent = expiry.date;
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

  return ranked;
}

const nodeFilters = [
  { key: 'all', label: () => t('allNodes'), test: () => true },
  { key: 'jp', label: () => 'JP 日本', test: (node) => /(^|\b|[^a-z])jp([^a-z]|\b|$)|日本|东京|大阪|japan|tokyo|osaka/i.test(node) },
  { key: 'hk', label: () => 'HK 香港', test: (node) => /(^|\b|[^a-z])hk([^a-z]|\b|$)|香港|hong\s*kong/i.test(node) },
  { key: 'sg', label: () => 'SG 新加坡', test: (node) => /(^|\b|[^a-z])sg([^a-z]|\b|$)|新加坡|singapore/i.test(node) },
  { key: 'tw', label: () => 'TW 台湾', test: (node) => /(^|\b|[^a-z])tw([^a-z]|\b|$)|台湾|臺灣|taiwan/i.test(node) },
  { key: 'us', label: () => 'US 美国', test: (node) => /(^|\b|[^a-z])us([^a-z]|\b|$)|美国|美國|usa|america|united states/i.test(node) },
  { key: 'kr', label: () => 'KR 韩国', test: (node) => /(^|\b|[^a-z])kr([^a-z]|\b|$)|韩国|韓國|korea|seoul/i.test(node) },
  { key: 'eu', label: () => 'EU 欧洲', test: (node) => /(^|\b|[^a-z])(eu|uk|de|fr|nl)([^a-z]|\b|$)|欧洲|歐洲|英国|德國|德国|france|germany|netherlands|europe/i.test(node) },
  { key: 'direct', label: () => 'DIRECT', test: (node) => /direct/i.test(node) }
];

function activeFilter() {
  return nodeFilters.find((filter) => filter.key === pickerFilter) || nodeFilters[0];
}

function openNodePicker(groupName) {
  pickerGroup = currentGroups.find((group) => group.name === groupName);
  if (!pickerGroup) {
    return;
  }

  pickerFilter = 'all';
  els.nodeSearchInput.value = '';
  els.nodePicker.classList.remove('hidden');
  renderNodePicker();
  requestAnimationFrame(() => els.nodeSearchInput.focus());
}

function closeNodePicker() {
  els.nodePicker.classList.add('hidden');
  pickerGroup = null;
}

function renderNodePicker() {
  if (!pickerGroup) {
    return;
  }

  const query = els.nodeSearchInput.value.trim().toLowerCase();
  const filter = activeFilter();
  let nodes = sortNodes(pickerGroup.all, pickerGroup.now)
    .filter((node) => filter.test(node))
    .filter((node) => !query || node.toLowerCase().includes(query));

  if (sortByDelay) {
    nodes = sortNodes(nodes, pickerGroup.now);
  }

  els.nodePickerTitle.textContent = pickerGroup.name;
  els.nodePickerSubtitle.textContent = `${pickerGroup.all.length} ${t('nodeCount')} · ${pickerGroup.now || '--'}`;
  els.testPickerBtn.disabled = testingPickerGroup;
  els.testPickerBtn.classList.toggle('testing', testingPickerGroup);
  els.testPickerBtn.querySelector('span').textContent = testingPickerGroup ? t('testingNodes') : t('testSelectedGroup');
  els.nodeFilters.innerHTML = nodeFilters.map((item) => {
    const count = pickerGroup.all.filter((node) => item.test(node)).length;
    return `
      <button class="node-filter${item.key === pickerFilter ? ' active' : ''}" data-filter="${item.key}">
        ${escapeHtml(item.label())}<span>${count}</span>
      </button>
    `;
  }).join('');

  els.nodeList.innerHTML = nodes.map((node) => {
    const active = node === pickerGroup.now ? ' active' : '';
    const safeNode = escapeHtml(node);
    const safeDelay = delayLabel(node);
    return `
      <button class="node-option${active}" data-node="${encodeURIComponent(node)}" title="${safeNode}">
        <span class="node-option-main">
          <strong>${safeNode}</strong>
          <small>${node === pickerGroup.now ? t('activeNode') : t('selectNode')}</small>
        </span>
        <span class="delay${delayClass(node)}">${safeDelay || '--'}</span>
      </button>
    `;
  }).join('') || `<div class="empty-state">${t('noMatch')}</div>`;

  els.nodeFilters.querySelectorAll('.node-filter').forEach((button) => {
    button.addEventListener('click', () => {
      pickerFilter = button.dataset.filter;
      renderNodePicker();
    });
  });

  els.nodeList.querySelectorAll('.node-option').forEach((button) => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      await api.switchProxy({
        group: pickerGroup.name,
        node: decodeURIComponent(button.dataset.node)
      });
      closeNodePicker();
      await refresh();
    });
  });
}

async function testPickerGroupDelay() {
  if (!pickerGroup || testingPickerGroup) {
    return;
  }

  testingPickerGroup = true;
  renderNodePicker();
  try {
    const groupName = pickerGroup.name;
    delayMap = { ...delayMap, ...(await api.testDelay({ group: groupName })) };
    localStorage.setItem('delayMap', JSON.stringify(delayMap));
    sortByDelay = true;
    localStorage.setItem('sortByDelay', String(sortByDelay));
    pickerGroup = currentGroups.find((group) => group.name === groupName) || pickerGroup;
    renderGroups();
  } finally {
    testingPickerGroup = false;
    renderNodePicker();
  }
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

    const previewNodes = [
      group.now,
      ...sortNodes(group.all, group.now).filter((node) => node !== group.now)
    ].filter(Boolean).slice(0, 4);
    const nodes = previewNodes.map((node) => {
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
        <button class="choose-btn" data-group="${encodeURIComponent(group.name)}">${t('chooseNode')}</button>
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

  els.groups.querySelectorAll('.choose-btn').forEach((button) => {
    button.addEventListener('click', () => {
      openNodePicker(decodeURIComponent(button.dataset.group));
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
  renderSubscriptionUsage(snapshot.subscriptionUsage);
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

async function refreshSubscriptionUsage() {
  els.refreshSubscriptionBtn.classList.add('loading');
  els.refreshSubscriptionBtn.disabled = true;
  els.subscriptionUnavailable.textContent = t('subscriptionRefreshing');
  try {
    await refresh();
  } finally {
    els.refreshSubscriptionBtn.classList.remove('loading');
    els.refreshSubscriptionBtn.disabled = false;
  }
}

async function loadSettings() {
  const config = await api.getConfig();
  els.hostInput.value = config.host;
  els.portInput.value = config.port;
  els.secretInput.value = config.secret || '';
  els.subscriptionUrlInput.value = config.subscriptionUrl || '';
  els.luciUsernameInput.value = config.luciUsername || 'root';
  els.luciPasswordInput.value = config.luciPassword || '';
  els.launchInput.checked = Boolean(config.launchAtLogin);
}

document.querySelector('#refreshBtn').addEventListener('click', refresh);
els.refreshSubscriptionBtn.addEventListener('click', refreshSubscriptionUsage);
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
    subscriptionUrl: els.subscriptionUrlInput.value.trim(),
    luciUsername: els.luciUsernameInput.value.trim() || 'root',
    luciPassword: els.luciPasswordInput.value,
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
els.nodeSearchInput.addEventListener('input', renderNodePicker);
els.testPickerBtn.addEventListener('click', testPickerGroupDelay);
document.querySelector('#closeNodePickerBtn').addEventListener('click', closeNodePicker);
els.nodePicker.addEventListener('click', (event) => {
  if (event.target === els.nodePicker) {
    closeNodePicker();
  }
});
els.sortDelayBtn.addEventListener('click', () => {
  sortByDelay = !sortByDelay;
  localStorage.setItem('sortByDelay', String(sortByDelay));
  renderGroups();
  renderNodePicker();
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
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !els.nodePicker.classList.contains('hidden')) {
    closeNodePicker();
  }
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
