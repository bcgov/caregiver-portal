import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from './auth/useAuth';

import { useAuth } from './auth/useAuth';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <App />
        </AuthProvider>
  </React.StrictMode>
);