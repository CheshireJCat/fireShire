import React, { useState, useEffect, useReducer } from "react";
import { v4 as uuidv4 } from "uuid";
import { default as marked } from "marked";
import { ShowTip } from "../utils";

const isElectron: boolean = window.isElectron;
const ipcRenderer = window.ipcRenderer;

type FormData = {
  uuid: string;
  title: string;
  tags: string[];
  category: number;
  public: boolean;
  complete: boolean;
};

type Action =
  | { type: "SET_title"; payload: string }
  | { type: "SET_tags"; payload: string[] }
  | { type: "SET_category"; payload: number }
  | { type: "SET_public"; payload: boolean }
  | { type: "SET_complete"; payload: boolean };

type Categories = { id: number; name: string }[];

const uuid = uuidv4();

function getCategories(): Categories {
  return [
    {
      id: 0,
      name: "未分类",
    },
    {
      id: 1,
      name: "life",
    },
    {
      id: 2,
      name: "code",
    },
    {
      id: 3,
      name: "game",
    },
  ];
}

const Input: React.FC<{
  value: string;
  /** onChange 回调函数 */
  change(value: string): void;
  placeholder?: string;
}> = ({ value, change, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => change(event.target.value)}
      placeholder={placeholder}
    />
  );
};

const CategorySel: React.FC<{ value: number; change(value: number): void }> = ({
  value,
  change,
}) => {
  let data = getCategories();
  return (
    <select
      name="category"
      value={value}
      onChange={(event) => change(parseInt(event.target.value))}
    >
      {data.map(({ id, name }) => {
        return (
          <option value={id} key={id}>
            {name}
          </option>
        );
      })}
    </select>
  );
};

function reducer(state: FormData, action: Action): FormData {
  switch (action.type) {
    case "SET_title":
      return { ...state, title: action.payload };
    case "SET_tags":
      return { ...state, tags: action.payload };
    case "SET_category":
      return { ...state, category: action.payload };
    case "SET_public":
      return { ...state, public: action.payload };
    case "SET_complete":
      return { ...state, complete: action.payload };
    default:
      return state;
  }
}

function preview(content: string): { __html: string } {
  return { __html: marked(content) };
}

const BlogNew: React.FC = () => {
  const [tempSaveTime, setTempSaveTime] = useState<number>(
    new Date().getTime()
  );
  const [content, setContent] = useState<string>("");
  const [formData, dispatch] = useReducer(reducer, {
    uuid,
    title: "",
    tags: [],
    category: 0,
    public: false,
    complete: true,
  });

  useEffect(() => {
    const now: number = new Date().getTime();
    if (now - tempSaveTime > 100) {
      // submit(formData)
      setTempSaveTime(now);
    }
  }, [tempSaveTime]);
  const [tip, setTip] = useState({msg:'',autoHide:false});

  async function createBlog(formData: FormData, content: string) {
    let { code, msg } = await ipcRenderer.invoke("blog-create", formData, content);
    if (code === 0) {
      setTip({msg:'保存成功',autoHide:true});
    } else {
      setTip({msg,autoHide:false});
    }
  }

  function submit(formData: FormData, content: string) {
    if (!isElectron)
      return {
        code: -1,
        msg: "当前环境是网页端，无法保存",
      };
      createBlog(formData,content);
  }

  return (
    <div>
      <form>
        <div>uuid:{uuid}</div>
        <div>
          <Input
            value={formData.title}
            change={(title: string) =>
              dispatch({ type: "SET_title", payload: title })
            }
          />
        </div>
        <div>
          <Input
            value={formData.tags.join(",")}
            change={(tags: string) =>
              dispatch({ type: "SET_tags", payload: tags.split(",") })
            }
            placeholder="标签：用,分隔"
          />
        </div>
        <div>
          <CategorySel
            value={formData.category}
            change={(category: number) =>
              dispatch({ type: "SET_category", payload: category })
            }
          />
        </div>
        <div>上次自动保存时间：{new Date(tempSaveTime).toLocaleString()}</div>
        <div
          onClick={() => {
            dispatch({ type: "SET_public", payload: !formData.public });
          }}
        >
          {!formData.public ? "不" : ""}公开展示
        </div>
        <div className="article">
          <textarea
            name=""
            onChange={(event) => {
              setContent(event.target.value);
            }}
          ></textarea>
        </div>
        <div className="buttons">
          <button type="button" onClick={() => submit(formData, content)}>
            保存
          </button>
          <label>
            <input
              type="checkbox"
              checked={formData.complete}
              name="uncomplete"
              onChange={(event) => {
                dispatch({
                  type: "SET_complete",
                  payload: event.target.checked,
                });
              }}
            />{" "}
            未完
          </label>
        </div>
        {JSON.stringify(formData)}
        <div dangerouslySetInnerHTML={preview(content)}></div>
      </form>
      {tip.msg && <ShowTip msg={tip.msg} onHide={()=>setTip({msg:'',autoHide:true})} autoHide={tip.autoHide}></ShowTip>}
    </div>
  );
};
export default BlogNew;
