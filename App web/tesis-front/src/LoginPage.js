import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate} from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación temporal de autenticación
    if (username.trim() === "admin" && password.trim() === "1234") {
      localStorage.setItem("auth", "true"); // simula sesión iniciada
      //alert("Inicio de sesión exitoso");
      navigate("/dashboard");
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="login-wrapper">
      <header className="login-header">
        <div className="logo-container">
          <img src={logoEspol} alt="ESPOL" className="espol-logo" />
          <h1>RX - TC</h1>
        </div>
      </header>

      <div className="login-box">
        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="usuario"
          className="user-icon"
        />
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={username}
            placeholder="Usuario"
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            value={password}
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="input-button">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
