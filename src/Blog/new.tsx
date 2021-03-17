import React, { useState, useEffect, useReducer, } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { default as marked } from 'marked';

const isElectron = window.isElectron; 
const ipcRenderer = window.ipcRenderer; 
console.log('isElectron:',isElectron);
console.log('ipcRenderer:',ipcRenderer);

interface action {
  type: string,
  newValue: any
}

const uuid = uuidv4();

function getCategories() {
  return [{
    id: 0,
    name: '未分类'
  }, {
    id: 1,
    name: 'life'
  }, {
    id: 2,
    name: 'code'
  }, {
    id: 3,
    name: 'game'
  }]
}

function Input(props: { change: Function, placeholder ? : string }) {
  const [value, setValue] = useState('');
  useEffect(() => {
    props.change(value);
  }, [value]);
  return <input type="text" value={value} onChange={event=>setValue(event.target.value)} placeholder={props.placeholder} />
}

function CategorySel(props: { change: Function }) {
  let data = getCategories();
  const [sel, setSel] = useState(data[0].id);
  useEffect(() => {
    props.change(sel);
  }, [sel]);
  return (
    <select name="category" onChange={event=>setSel(parseInt(event.target.value))}>
      {
        data.map(({id,name})=>{
          return <option value={id} key={id}>{name}</option>
        })
      }
    </select>
  )
}


function reducer(formData: any, action: action) {
  // switch(action.type){
  //   case 'title': return {...formData,'title':action.newValue};
  //   case 'tags': return {...formData,'tags':action.newValue};
  //   case 'category': return {...formData,'category':action.newValue};
  //   default: return formData;
  // }
  return { ...formData, [action.type]: action.newValue }
}

function submit(formData: any, content: string) {
  console.log(formData);
  ipcRenderer.send('blog-create',formData,content);
}

export default function BlogNew() {
  function autoSave() {
    const now: number = new Date().getTime();
    if (now - tempSaveTime > 100) {
      console.log('autoSave');
      // submit(formData)
      setTempSaveTime(now);
    }
  }

  function preview(content:string){
    return {__html: marked(content)};
  }

  const [formData, dispatch] = useReducer(reducer, {
    uuid,
    title: '',
    tags: [],
    category: 0,
    public: false,
    complete: true
  });
  useEffect(() => {
    autoSave();
  }, [formData.title]);

  const [tempSaveTime, setTempSaveTime] = useState(new Date().getTime());
  const [content, setContent] = useState('');

  return (
    <form>
      <div>uuid:{uuid}</div>
      <div><Input change={(title:string) => dispatch({type:'title',newValue: title})} /></div>
      <div><Input change={(tags:string) => dispatch({type:'tags',newValue: tags.split(',')})} placeholder="标签：用,分隔" /></div>
      <div><CategorySel change={(category:number) => dispatch({type:'category',newValue: category})} /></div>
      <div>上次自动保存时间：{new Date(tempSaveTime).toLocaleString()}</div>
      <div onClick={()=>{dispatch({type:'public',newValue: !formData.public})}}>{!formData.public ? '不' : ''}公开展示</div>
      <div className="article">
        <textarea name="" onChange={(event)=>{setContent(event.target.value)}}></textarea>
      </div>
      <div className="buttons">
        <button type="button" onClick={()=>submit(formData,content)}>保存</button>
        <label><input type="checkbox" checked={formData.complete} name="uncomplete" onChange={(event)=>{dispatch({type:'complete',newValue: event.target.checked})}} /> 未完</label>
      </div>
      {JSON.stringify(formData)}
      <div dangerouslySetInnerHTML={preview(content)}></div> 
    </form>
  )
}