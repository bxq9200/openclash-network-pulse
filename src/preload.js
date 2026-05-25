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
  close: () => ipcRenderer.invoke('window:close')
});
