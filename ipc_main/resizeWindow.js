const { ipcMain } = require('electron');

function init(mainWindow){
  // 通信
  ipcMain.on('min', function() {
    mainWindow.minimize();
  });
  ipcMain.on('max', function() {
    mainWindow.maximize();
  });
  ipcMain.on('start', function() {
    mainWindow.maximize();
  });
}

module.exports = {
  init: init
}