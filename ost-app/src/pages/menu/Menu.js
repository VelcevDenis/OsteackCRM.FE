import React, { useState } from "react";
import { useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../../utils/authHelper';
import { useTranslation } from 'react-i18next';

const App = () => {
  const { t } = useTranslation();

  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item, route) => {
    setActiveItem(item);
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={`wrapper ${isExpanded ? "expand" : ""}`}>
      <aside id="sidebar" className={`sidebar ${isExpanded ? "expand" : ""}`}>
        <div className="d-flex">
          <button className="toggle-btn" type="button" onClick={toggleSidebar}>
            <i className="lni lni-grid-alt"></i>
          </button>
          <div className="sidebar-logo">
            <a href="#">OsteackOU</a>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "dashboard" ? "active" : ""}`}
              onClick={() => handleItemClick("dashboard", "/menu/dashboard")}
            >
              <i className="lni lni-dashboard-square-1"></i>
              <span>{t('dashboard')}</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link collapsed has-dropdown`}
              data-bs-toggle="collapse"
              data-bs-target="#auth"
              aria-expanded="false"
              aria-controls="auth"
            >
              <i className="lni lni-user-multiple-4"></i>
              <span>{t('users')}</span>
            </a>
            <ul id="auth" className="sidebar-dropdown list-unstyled collapse">
              <li className="sidebar-item">
                <a
                  href="#"
                  className={`sidebar-link ${activeItem === "employees" ? "active" : ""}`}
                  onClick={() => handleItemClick("employees", "/menu/employees")}
                >
                  {t('employees')}
                </a>
              </li>
              <li className="sidebar-item">
                <a
                  href="#"
                  className={`sidebar-link ${activeItem === "PotencialClients" ? "active" : ""}`}
                  onClick={() => handleItemClick("PotencialClients", "/menu/PotencialClients")}
                >
                  {t('potential_companies')}
                </a>
              </li>
            </ul>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "logs" ? "active" : ""}`}
              onClick={() => handleItemClick("logs", "/menu/logs")}
            >
              <i className="lni lni-megaphone-1"></i>
              <span>{t('logs')}</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "setting" ? "active" : ""}`}
              onClick={() => handleItemClick("setting", "/menu/setting")}
            >
              <i className="lni lni-code-1"></i>
              <span>{t('setting')}</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "setting" ? "active" : ""}`}
              onClick={handleLogout}
            >
              <i className="lni lni-exit"></i>
              <span>{t('logout')}</span>
            </a>
          </li>
        </ul>        
      </aside>
      <div className="main p-3">
        <Outlet /> {/* Render nested routes here */}
      </div>
    </div>
  );
};

export default App;
