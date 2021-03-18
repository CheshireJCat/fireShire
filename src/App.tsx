import React from 'react';
import { HashRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';

import Blog from './Blog';
import About from './About';

// function start(){
//   const ipcRenderer = window.ipcRenderer;
//   ipcRenderer.send('start');
// }

function Home(){
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
    )
}

function App() {
  console.log(window.isElectron)
  const ipcRenderer = window.ipcRenderer;
  console.log(ipcRenderer)
  return (
    <Router>
      <header>
        <Link to="/">Nekos</Link>
      </header>
      <Switch>
        <Route path="/blog">
          <Blog />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="*">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
