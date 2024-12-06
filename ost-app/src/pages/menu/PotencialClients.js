import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../utils/authHelper'; // Импортируем функции

const App = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item); // Устанавливаем активный элемент
  };

  // Обработка выхода
  const handleLogout = () => {
    logout(); // Выход из системы
    navigate("/"); // Перенаправление на страницу логина
  };

  return (
    <div className={`wrapper ${isExpanded ? "expand" : ""}`}>
      <aside id="sidebar" className={`sidebar ${isExpanded ? "expand" : ""}`}>
        <div className="d-flex">
          <button className="toggle-btn" type="button" onClick={toggleSidebar}>
            <i className="lni lni-grid-alt"></i>
          </button>
          <div className="sidebar-logo">
            <a href="#">CodzSword</a>
          </div>
        </div>
        <ul className="sidebar-nav">
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "dashboard" ? "active" : ""}`}
              onClick={() => handleItemClick("dashboard")}
            >
              <i className="lni lni-dashboard-square-1"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link collapsed has-dropdown ${activeItem === "users" ? "active" : ""}`}
              data-bs-toggle="collapse"
              data-bs-target="#auth"
              aria-expanded="false"
              aria-controls="auth"
              onClick={() => handleItemClick("users")}
            >
              <i className="lni lni-user-multiple-4"></i>
              <span>Users</span>
            </a>
            <ul id="auth" className="sidebar-dropdown list-unstyled collapse">
              <li className="sidebar-item">
                <a
                  href="#"
                  className={`sidebar-link ${activeItem === "employees" ? "active" : ""}`}
                  onClick={() => handleItemClick("employees")}
                >
                  Employees
                </a>
              </li>
              <li className="sidebar-item">
                <a
                  href="#"
                  className={`sidebar-link ${activeItem === "clients" ? "active" : ""}`}
                  onClick={() => handleItemClick("clients")}
                >
                  Potential Clients
                </a>
              </li>
            </ul>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "logs" ? "active" : ""}`}
              onClick={() => handleItemClick("logs")}
            >
              <i className="lni lni-megaphone-1"></i>
              <span>Logs</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a
              href="#"
              className={`sidebar-link ${activeItem === "setting" ? "active" : ""}`}
              onClick={() => handleItemClick("setting")}
            >
              <i className="lni lni-code-1"></i>
              <span>Setting</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout}>
            <i className="lni lni-exit"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <div className="main p-3">
        <div className="text-center">
          <h1>Sidebar Bootstrap 5</h1>
        </div>
      </div>
    </div>
  );
};

export default App;
