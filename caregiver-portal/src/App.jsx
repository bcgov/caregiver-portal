// src/App.jsx
import React from "react";
import AppShell from "./AppShell";

function App() {
  window.localStorage.setItem("oidc-client:log", "debug");
  return <AppShell />;
}

export default App;