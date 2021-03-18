import React, { useState, useEffect, useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { default as marked } from 'marked';

const isElectron = window.isElectron;
const ipcRenderer = window.ipcRenderer;
console.log('isElectron:', isElectron);
console.log('ipcRenderer:', ipcRenderer);

interface action {
  type: string;
  newValue: any;
}

interface formData {
  uuid: string;
  title: string;
  tags: string[];
  category: number;
  public: boolean;
  complete: boolean;
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

function Input({ value, change, placeholder }: { value: string, change: Function, placeholder ? : string }) {
  return <input type="text" value={value} onChange={event=>change(event.target.value)} placeholder={placeholder} />
}

function CategorySel({ value, change }: { value: number, change: Function }) {
  let data = getCategories();
  return (
    <select name="category" value={value} onChange={event=>change(parseInt(event.target.value))}>
      {
        data.map(({id,name})=>{
          return <option value={id} key={id}>{name}</option>
        })
      }
    </select>
  )
}


function reducer(formData: formData, action: action) {
  // switch(action.type){
  //   case 'title': return {...formData,'title':action.newValue};
  //   case 'tags': return {...formData,'tags':action.newValue};
  //   case 'category': return {...formData,'category':action.newValue};
  //   default: return formData;
  // }
  return { ...formData, [action.type]: action.newValue }
}

function submit(formData: formData, content: string) {
  if(!isElectron) return;
  ipcRenderer.send('blog-create', formData, content);
}

export default function BlogNew() {
  function preview(content: string) {
    return { __html: marked(content) };
  }

  const [tempSaveTime, setTempSaveTime] = useState(new Date().getTime());
  const [content, setContent] = useState('');
  const [formData, dispatch] = useReducer(reducer, {
    uuid,
    title: '',
    tags: [],
    category: 0,
    public: false,
    complete: true
  });
  useEffect(() => {
    const now: number = new Date().getTime();
    if (now - tempSaveTime > 100) {
      console.log('autoSave');
      // submit(formData)
      setTempSaveTime(now);
    }
  }, [tempSaveTime]);

  return (
    <form>
      <div>uuid:{uuid}</div>
      <div><Input value={formData.title} change={(title:string) => dispatch({type:'title',newValue: title})} /></div>
      <div><Input  value={formData.tags.join(',')} change={(tags:string) => dispatch({type:'tags',newValue: tags.split(',')})} placeholder="标签：用,分隔" /></div>
      <div><CategorySel value={formData.category} change={(category:number) => dispatch({type:'category',newValue: category})} /></div>
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