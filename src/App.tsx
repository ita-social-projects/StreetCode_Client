import React from 'react';
import './App.css';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route } from "react-router-dom";
const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
      <div className="App">
          <Router>
              <div className="mainContent">
                  <h1>Closer</h1>
                  <div>Roboto</div>
              </div>
          </Router>
      </div>

  );
}

export default App