const { ipcMain } = require('electron');
const blog = require('./blog');
const resizeWindow = require('./resizeWindow');

function init(mainWindow){
  resizeWindow.init(mainWindow);
  blog.init();
}

module.exports = init;