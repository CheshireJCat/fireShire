const blogs = require('../blogs/index');

console.log(blogs);

function resizeWindow(ipcMain, mainWindow){
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

function blog(ipcMain, mainWindow){
  ipcMain.on('blog-list', function(event,uuid){
    blogs.getBlogList();
  });

  ipcMain.on('blog-create', function(event,data,content){
    console.log(data,content);
    mainWindow.maximize();
    blogs.createBlog(data,content);
  });

  ipcMain.on('blog-edit', function(event,data,content){
    blogs.updateBlog(data,content);
  });

  ipcMain.on('blog-del', function(event,uuid){
    blogs.deleteBlog(uuid);
  });
}

function init(ipcMain, mainWindow){
  resizeWindow(ipcMain, mainWindow);
  blog(ipcMain, mainWindow);
}

module.exports = init;