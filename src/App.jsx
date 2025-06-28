import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Invoice from "./components/Invoice";
import './App.css';
import NavbarComponent from "./components/navbar";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<NavbarComponent />} />
        <Route path="/invoice" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
