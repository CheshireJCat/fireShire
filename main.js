const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow = null;
const debug = /--debug/.test(process.argv[2]);

function makeSingleInstance(){
  if(process.mas) return;
  app.requestSingleInstanceLock();
  app.on('second-instance', () => {
    if(mainWindow){
      if(mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  })
}

function createWindow() {
  const windowOptions = {
    width: 400,
    height: 300,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
    }
  };

  mainWindow = new BrowserWindow(windowOptions);
  if(debug){
    mainWindow.loadURL("http://localhost:3000/");
  }else{
    mainWindow.loadURL(url.format({
      pathname:path.join(__dirname, './build/index.html'), 
      protocol:'file:', 
      slashes:true 
    }))
  }
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

  if(debug){
    mainWindow.webContents.openDevTools();
    // require('devtron').install();
  }

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

makeSingleInstance();

app.on('ready', function(event) {
  createWindow();
});

app.on('window-all-closed', () => {
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

app.on('activate', () => {
  if(mainWindow === null){
    createWindow();
  }
});

module.exports = mainWindow;