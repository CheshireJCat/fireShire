import React, { useState, useEffect, useReducer, } from 'react';


interface action {
  type: string,
  newValue: any
}



function Input(props:{change:Function,placeholder?:string}) {
  const [ value, setValue] = useState('');
  useEffect(()=>{
    props.change(value);
  })
  return <input type="text" value={value} onChange={event=>setValue(event.target.value)} placeholder={props.placeholder} />
}

export default function BlogNew() {
  function reducer(formData: any, action: action){
    switch(action.type){
      case 'title':
      return Object.assign(formData,{title:action.newValue});
      case 'tags':
      return Object.assign(formData,{tags:action.newValue});
    }
  }
  
  let [formData,dispatch] = useReducer(reducer, {
    title: '',
    tags: []
  });  

  function submit(){
    console.log(formData);
  }

  return (
    <form>
      <div><Input change={(title:string) => dispatch({type:'title',newValue: title})} /></div>
      <div><Input change={(tags:string) => dispatch({type:'tags',newValue: tags.split(',')})} placeholder="标签：用,分隔" /></div>
      <div><input type="text" placeholder="分类" /></div>
      <div>上次自动保存时间：2021年3月16日16:47:25</div>
      <div>是否公开展示</div>
      <div className="article">
        <textarea name=""></textarea>
      </div>
      <div className="buttons">
        <button type="button" onClick={()=>submit()}>保存</button>
        <label><input type="checkbox" name="uncomplete" /> 未完</label>
      </div>
    </form>
    )
}