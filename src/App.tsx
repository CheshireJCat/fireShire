import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  let start = () => {
    const electron = window.require('electron');
    const ipcRenderer = electron.ipcRenderer;
    console.log(123)
    ipcRenderer.send('start');
  }
  return (
    <div className="App">
      <header className="App-header">
        <img onClick={this.start} src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
