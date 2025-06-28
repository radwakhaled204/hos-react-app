import React, { useState } from 'react';
import './assets/styles/app.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import Invoice from "./assets/components/Invoice";
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div>
            <div>
              <a href="https://vite.dev" target="_blank" rel="noreferrer">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank" rel="noreferrer">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
              <button onClick={() => setCount((count) => count + 1)}>
                count is {count}
              </button>
              <p>
                Edit <code>src/App.jsx</code> and save to test HMR
              </p>
            </div>
            <p className="read-the-docs">
              Click on the Vite and React logos to learn more
            </p>
          </div>
        } />
        <Route path="/Invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
