import React, { useState } from "react";

const App = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
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
            <a href="#" className="sidebar-link">
              <i class="lni lni-dashboard-square-1"></i>
              <span>Dashboard</span>
            </a>
          </li>
          {/* <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i className="lni lni-agenda"></i>
              <span>Task</span>
            </a>
          </li> */}
          <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed has-dropdown"
              data-bs-toggle="collapse"
              data-bs-target="#auth"
              aria-expanded="false"
              aria-controls="auth"
            >
              <i class="lni lni-user-multiple-4"></i>
              <span>Users</span>
            </a>
            <ul id="auth" className="sidebar-dropdown list-unstyled collapse">
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Employees
                </a>
              </li>
              <li className="sidebar-item">
                <a href="#" className="sidebar-link">
                  Potential Clients
                </a>
              </li>
            </ul>
          </li>
          {/* <li className="sidebar-item">
            <a
              href="#"
              className="sidebar-link collapsed has-dropdown"
              data-bs-toggle="collapse"
              data-bs-target="#multi"
              aria-expanded="false"
              aria-controls="multi"
            >
              <i className="lni lni-layout"></i>
              <span>Multi Level</span>
            </a>
            <ul id="multi" className="sidebar-dropdown list-unstyled collapse">
              <li className="sidebar-item">
                <a
                  href="#"
                  className="sidebar-link collapsed"
                  data-bs-toggle="collapse"
                  data-bs-target="#multi-two"
                  aria-expanded="false"
                  aria-controls="multi-two"
                >
                  Two Links
                </a>
                <ul id="multi-two" className="sidebar-dropdown list-unstyled collapse">
                  <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                      Link 1
                    </a>
                  </li>
                  <li className="sidebar-item">
                    <a href="#" className="sidebar-link">
                      Link 2
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i class="lni lni-megaphone-1"></i>
              <span>Logs</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <i class="lni lni-code-1"></i>
              <span>Setting</span>
            </a>
          </li>
        </ul>
        <div className="sidebar-footer">
          <a href="#" className="sidebar-link">
            <i className="lni lni-exit"></i>
            <span>Logout</span>
          </a>
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
