import { useEffect, useReducer } from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import BlogNew from "./new";
import { Toast } from "../utils";

const isElectron: boolean = window.isElectron;
const ipcRenderer = window.ipcRenderer;

type FetchStatus = {
  isLoading: boolean;
  isError: boolean;
  data: any[];
};

type Action =
  | { type: "loading"; payload?: string }
  | { type: "error"; payload?: string }
  | { type: "success"; payload: any[] };

const getBlogList = async (): Promise<any> => {
  if (!isElectron) return {
    code: -1,
    msg: '此环境暂无数据',
    data: []
  };
  return await ipcRenderer.invoke("blog-list");
};

const CreateBlogButton: React.FC = () => {
  return (
    <button>
      <Link to="/blog/new">写博客</Link>
    </button>
  );
};

function reducer(state: FetchStatus, action: Action): FetchStatus {
  switch (action.type) {
    case "loading":
      return { data: [], isLoading: true, isError: false };
    case "error":
      return { data: [], isLoading: false, isError: true };
    case "success":
      return { data: action.payload, isLoading: false, isError: true };
    default:
      return state;
  }
}

const BlogList: React.FC = () => {
  let [state, dispatch] = useReducer(reducer, {
    isLoading: false,
    isError: false,
    data: [],
  });
  useEffect(() => {
    let isDestory: boolean = false;
    const fetchData = async () => {
      dispatch({ type: "loading", payload: "" });
      let {
        code,
        msg = "获取博客列表失败，原因未知",
        data = [],
      } = await getBlogList();
      if (code === 0) {
        console.log(data);
        dispatch({ type: "success", payload: data });
      } else {
        dispatch({ type: "error" });
        Toast.showToast({
          msg,
        });
      }
    };
    fetchData();
    return () => {
      isDestory = true;
      console.log(isDestory)
    };
  }, []);
  return (
    <div>
      <header>
        <span>Blog</span>
        {/*新建博客*/}
        <CreateBlogButton />
        {/*搜索博客*/}
        <input type="text" />
      </header>
      <div className="container">
        {/*博客列表*/}
        <div className="list">
          {state.data.map((item) => {
            return (
              <div key={item.uuid}>
                <Link to="/blog/c">
                  {item.title}
                </Link>
              </div>
            );
          })}
        </div>
        {/*快速查看*/}
        <div className="right">
          {/*类别*/}
          <div className="categorys"></div>
          {/*标签*/}
          <div className="times"></div>
          {/*时间*/}
          <div className="tags"></div>
        </div>
      </div>
    </div>
  );
};

export default function Blog() {
  return (
    <Router>
      <Switch>
        <Route path="/blog/new">
          <BlogNew />
        </Route>
        <Route path="/blog">
          <BlogList />
        </Route>
      </Switch>
    </Router>
  );
}
