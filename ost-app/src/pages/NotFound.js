import React from "react";

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h2>404 - Page Not Found</h2>
        <p className="error-message">The page you are looking for might have been moved or deleted.</p>
        <div className="footer-links">
          <button className="link-btn" onClick={() => window.history.back()}>Go Back</button>
          <button className="link-btn" onClick={() => window.location.href = '/'}>Go to Home</button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
