import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Invoice from "./components/Invoice";
import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Invoice />} />
        <Route path="/" element={<Invoice />} />
      </Routes>
    </Router>
  );
}

export default App;
