import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import ProtectedPage from "./pages/Protected";
import Registration from "./pages/Registration";



function App(){
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/protected" element={<ProtectedPage />} />
      <Route path="/register" element={<Registration />} />
      </Routes>
    </Router>
  );
}

export default App;