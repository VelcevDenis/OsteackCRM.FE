import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import './styles/menu.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n'; // Import i18n config
import "lineicons/dist/lineicons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Measure app performance
reportWebVitals();
