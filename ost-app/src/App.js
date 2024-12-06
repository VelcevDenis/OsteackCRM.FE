import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import Registration from "./pages/Registration";
import PotencialClients from "./pages/menu/PotencialClients";

function App(){
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/register" element={<Registration />} />
      <Route path="/potencialClients" element={<PotencialClients />} />
      <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;