function init(mainWindow){
  // 通信
  const ipc = require("electron").ipcMain;
  ipc.on('min', function() {
    mainWindow.minimize();
  });
  ipc.on('max', function() {
    mainWindow.maximize();
  });
  ipc.on('start', function() {
    mainWindow.maximize();
  });
}

module.exports = init;