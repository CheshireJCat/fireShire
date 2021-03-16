const { contextBridge, ipcRenderer } = require('electron');

// 需要用到的api暴露给 render 进程
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);