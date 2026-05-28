const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('openClashWidget', {
  getConfig: () => ipcRenderer.invoke('config:get'),
  setConfig: (config) => ipcRenderer.invoke('config:set', config),
  getSnapshot: () => ipcRenderer.invoke('snapshot:get'),
  switchProxy: (payload) => ipcRenderer.invoke('proxy:switch', payload),
  testDelay: (payload) => ipcRenderer.invoke('proxy:testDelay', payload),
  minimize: () => ipcRenderer.invoke('window:minimize'),
  toggleMaximize: () => ipcRenderer.invoke('window:toggleMaximize'),
  getMaximized: () => ipcRenderer.invoke('window:isMaximized'),
  onMaximizedChange: (callback) => {
    ipcRenderer.on('window:maximized-change', (_, isMaximized) => callback(isMaximized));
  },
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  getUpdateStatus: () => ipcRenderer.invoke('update:status'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  openReleases: () => ipcRenderer.invoke('update:openReleases'),
  onUpdateStatus: (callback) => {
    ipcRenderer.on('update:status', (_, status) => callback(status));
  },
  close: () => ipcRenderer.invoke('window:close')
});
