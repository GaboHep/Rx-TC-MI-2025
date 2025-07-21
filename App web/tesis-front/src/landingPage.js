import React from "react";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import xraysPrincipal from "./assets/xraysPrincipal.png"


export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <img src={logoEspol} alt="ESPOL Logo" className="logo" />
        <h1 className="header-title">RX - TC</h1>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login <span>👤</span>
        </button>
      </header>

      <main className="landing-main">
        <img src={xraysPrincipal} alt="Radiografía" className="radiografia-img" />
      </main>
    </div>
  );
}
