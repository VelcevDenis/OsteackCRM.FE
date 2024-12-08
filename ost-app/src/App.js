import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import NotFoundMenu from "./pages/menu/NotFoundMenu";
import Registration from "./pages/Registration";
import Menu from "./pages/menu/Menu";
import Dashboard from "./pages/menu/Dashboard";
import Employees from "./pages/menu/Employees";
import PotentialClients from "./pages/menu/PotentialClients";
import Logs from "./pages/menu/Logs";
import Settings from "./pages/menu/Settings";
import { isAuthenticated } from './utils/authHelper';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route
          path="/menu/*"
          element={isAuthenticated() ? <Menu /> : <Login />}
        >
          {/* Define the nested routes here */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="PotencialClients" element={<PotentialClients />} />
          <Route path="logs" element={<Logs />} />
          <Route path="setting" element={<Settings />} />
          <Route path="*" element={<NotFoundMenu />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;