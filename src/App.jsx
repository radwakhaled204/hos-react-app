// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Invoice from "./components/Invoice";
import Preview from "./components/Preview";
import NavbarComponent from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import './App.css';

function App() {
    return (
        <Router>
          
<Routes>
    {/* <Route path="/" element={<Login />} /> */}
        <Route index element={<Login />} />   
    <Route path="/signup" element={<Signup />} />
  <Route path="/" element={<Login />} />
<Route path="/home" element={<NavbarComponent />} />

    <Route path="/invoice" element={<Invoice />} />
    <Route path="/preview" element={<Preview />} />
</Routes>

        </Router>
    );
}

export default App;
