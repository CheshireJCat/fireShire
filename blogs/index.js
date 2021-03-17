const path = require('path');
const fs = require('fs');
const listFileName = path.join('list.json');

function readFile(dir) {
  return new Promise((resolve, reject) => {
    fs.readFile(dir, 'utf-8', (err, data) => {
      if (err) {
        reject(console.log(err))
      } else {
        resolve(data)
      }
    })
  });
}

function writeFile(filename, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(filename), content, (err, data) => {
      if (err) {
        reject(console.log(err))
      }
      resolve(content);
    })
  });
}

function existFile(filename){
  return new Promise((resolve) => {
    fs.exists(filename, (exist) => {
      resolve(exist);
    })
  });
}

function removeFile(filename){
  return new Promise((resolve,reject)=>{
      fs.unlink(filename,(err)=>{
          if(err){
              reject(console.log(err))
          }
          resolve()
      });
  })
}

async function getFile(filename, content) {
  let exist = await existFile(filename);
  if(!exist){
    await writeFile(filename,content);
  }
  return readFile(filename);
}

function updateList(list, data) {
  let len = list.length;
  let exist = false;
  let { uuid } = data;
  for (let i = 0; i < len; i++) {
    if (list[i].uuid == uuid) {
      exist = true;
      list[i] = Object.assign(list[i],data);
    }
  }
  if (!exist) {
    list.push(data);
  }
  return list;
}

function removeItem(list, uuid){
  let len = list.length;
  for (let i = 0; i < len; i++) {
    if (list[i].uuid == uuid) {
      list.splice(i,1);
    }
  }
  return list;
}

async function getBlogList(){
  let list = await getFile(listFileName, '[]');
  if(typeof list == 'string'){
    list = JSON.parse(list);
  }
  return list;
}

async function getMarkdown(uuid){
  return await getFile(uuid+'.md', '[]');
}

async function removeMarkdown(uuid){
  let filename = uuid+'.md';
  let exist = await existFile(filename);
  if(exist){
    await removeFile(filename);
  }
  return '删除成功';
}

async function updateMarkdown(uuid, content) {
  let filename = uuid + '.md';
  let exist = await existFile(filename);
  if(!exist){
    await getFile(filename, '');
  }
  await writeFile(filename, content);
}

async function updateBlog(data, content) {
  let { uuid } = data;
  let list = await getBlogList();
  list = updateList(list, data);
  await writeFile(listFileName, JSON.stringify(list));
  await updateMarkdown(uuid, content);
}

async function deleteBlog(uuid) {
  let list = await getBlogList();
  list = removeItem(list, uuid);
  await writeFile(listFileName, JSON.stringify(list));
  await removeMarkdown(uuid);
}
const createBlog = updateBlog;

// createBlog({uuid:123},'234');
// getBlogList().then(res=>{console.log(res);})
// getMarkdown(123).then(res=>{console.log(res);})

module.exports = {
  getBlogList,
  getMarkdown,
  updateBlog,
  createBlog,
  deleteBlog,
}