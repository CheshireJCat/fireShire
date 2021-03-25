import React, { useState, useEffect, useReducer } from "react";
import { default as marked } from "marked";
import { Toast } from "../utils";
import { categories } from "../config";
import { useHistory } from "react-router-dom";

type Action =
  | { type: "SET_title"; payload: string }
  | { type: "SET_tags"; payload: string[] }
  | { type: "SET_category"; payload: number }
  | { type: "SET_public"; payload: boolean }
  | { type: "SET_complete"; payload: boolean };

type FormData = {
  title: string;
  tags: string[];
  category: number;
  public: boolean;
  complete: boolean;
};

const isElectron: boolean = window.isElectron;
const ipcRenderer = window.ipcRenderer;
const { showToast } = Toast;

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
  return (
    <select
      name="category"
      value={value}
      onChange={(event) => change(parseInt(event.target.value))}
    >
      {categories.map(({ id, name }) => {
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

function submit(formData: FormData, content: string, history: any) {
  if (!isElectron) {
    showToast({
      msg: "当前环境是网页端，暂无法保存",
    });
    return;
  }
  createBlog(formData, content, history);
}

async function createBlog(formData: FormData, content: string, history: any) {
  if (!formData.title) {
    showToast({
      msg: "标题不能为空",
    });
    return;
  }
  let { code, msg } = await ipcRenderer.invoke(
    "blog-create",
    formData,
    content
  );
  if (code === 0) {
    showToast({
      msg: "保存成功",
      onHide() {
        history.replace("/blog");
        // window.location.href = '/blog'
      },
    });
  } else {
    showToast({
      msg,
      autoHide: false,
    });
  }
}

const BlogNew: React.FC = () => {
  const history = useHistory();
  const [tempSaveTime, setTempSaveTime] = useState<number>(
    new Date().getTime()
  );
  const [content, setContent] = useState<string>("");
  const [formData, dispatch] = useReducer(reducer, {
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

  return (
    <div>
      <form>
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
          <button
            type="button"
            onClick={() => submit(formData, content, history)}
          >
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
    </div>
  );
};
export default BlogNew;
