import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { categoriesMap } from "../config";

const isElectron: boolean = window.isElectron;
const ipcRenderer = window.ipcRenderer;

const getContent = async (uuid: string) => {
  if (!isElectron) {
    return {
      code: -1,
      msg: "此环境暂无数据",
      data: "",
    };
  }
  return ipcRenderer.invoke("blog-detailContent", uuid);
};

const getDetailData = async (uuid: string) => {
  if (!isElectron) {
    return {
      code: -1,
      msg: "此环境暂无数据",
      data: "",
    };
  }
  return ipcRenderer.invoke("blog-detailData", uuid);
};

let defaultState: blogDetail = {
  complete: true,
  createTime: 0,
  public: false,
  tags: [],
  title: "",
  updateTime: 0,
  uuid: "",
  category: 0,
};

const Detail: React.FC = () => {
  let { uuid } = useParams<{ uuid: string }>();
  let location = useLocation<blogDetail>();

  if (!location.state) {
  }
  console.log(location);
  let [data, setData] = useState(defaultState);
  useEffect(() => {
    let isDestory: boolean = false;
    const fetchData = async () => {
      let {
        code,
        msg = "获取博客列表失败，原因未知",
        data = "",
      } = await getDetailData(uuid);
      if (code === 0) {
        console.log(data);
        setData(data);
      } else {
        setData(Object.assign(defaultState, { title: msg }));
      }
    };
    fetchData();
    return () => {
      isDestory = true;
      console.log(isDestory);
    };
  }, []);
  let [content, setContent] = useState("");
  useEffect(() => {
    let isDestory: boolean = false;
    const fetchData = async () => {
      let {
        code,
        msg = "获取博客内容失败，原因未知",
        data = "",
      } = await getContent(uuid);
      if (code === 0) {
        console.log(data);
        setContent(data);
      } else {
        setContent(msg);
      }
    };
    fetchData();
    return () => {
      isDestory = true;
      console.log(isDestory);
    };
  }, []);
  return (
    <div>
      <Link to="/blog">Blog</Link>
      <header>
        <title>{data.title}</title>
        <div>
          <span>{categoriesMap.get(data.category)}</span>|
          <span>标签：{data.tags.join("")}</span>|
          <span>创建时间: {data.createTime}</span>|
          <span>更新时间: {data.updateTime}</span>
        </div>
      </header>
      <section>{content}</section>
      <div>{!data.complete && "未完待续"}</div>
    </div>
  );
};
export default Detail;
