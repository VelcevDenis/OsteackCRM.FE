import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Login from './pages/Login';
import NotFound from "./pages/NotFound";
import NotFoundMenu from "./pages/menu/NotFoundMenu";
import Registration from "./pages/Registration";
import Menu from "./pages/menu/Menu";
import Dashboard from "./pages/menu/Dashboard";
import Employees from "./pages/menu/Employees";
import PotencialClients from "./pages/menu/PotencialClients";
import Logs from "./pages/menu/Logs";
import Settings from "./pages/menu/Settings";
import { isAuthenticated, getUserRole } from './utils/authHelper';
import LanguageSwitcher from "./components/LanguageSwitcher";


// import { isAuthenticated, getUserRole } from './utils/authHelper';

// <Route
//   path="/menu/employees"
//   element={isAuthenticated() && getUserRole() === 1 ? <Employees /> : <NotFound />}
// />
// if (getUserRole() === 1) {
//   console.log("Пользователь - админ");
// }


function App() {
  const { t } = useTranslation();

  return (
    <Router>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/menu/*" element={isAuthenticated() ? <Menu /> : <Login />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="PotencialClients" element={<PotencialClients />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFoundMenu />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
