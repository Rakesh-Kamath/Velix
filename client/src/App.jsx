import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <nav style={{ padding: "10px", background: "#222" }}>
        <Link to="/login" style={{ color: "white", marginRight: "15px" }}>Login</Link>
        <Link to="/register" style={{ color: "white", marginRight: "15px" }}>Register</Link>
        <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
