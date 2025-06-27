// src/pages/Home.jsx
import { useAuth } from "react-oidc-context";
import "../App.css";

export default function Home() {
  const auth = useAuth();

  return (
    <div>
      <h1>Landing Page</h1>
      <button onClick={() => auth.signinRedirect()}>Log In</button>
    </div>
  );
}