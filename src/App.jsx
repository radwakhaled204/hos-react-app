import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Invoice from "./components/Invoice";
import './App.css';
import NavbarComponent from "./components/Navbar";
import Preview from "./components/Preview";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavbarComponent />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/preview" element={<Preview />} />

      </Routes>
    </Router>
  );
}

export default App;
