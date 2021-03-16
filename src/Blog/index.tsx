import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import BlogNew from './new'

function CreateBlogButton() {
  return (
    <button>
      <Link to="/blog/new">写博客</Link>
    </button>
  )
}

function BlogList() {
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
        <div className="list"></div>
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
  )
}

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
  )
}