import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './styles.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// main.jsx is the frontend entry point.
// React renders App into the <div id="root"> from index.html.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter enables URL-based navigation without full page reloads. */}
    <BrowserRouter>
      {/* AuthProvider stores the logged-in user and exposes login/register/logout helpers. */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
