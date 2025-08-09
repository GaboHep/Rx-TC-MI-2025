import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import { useAuth } from "./context/AuthContext"; // Asegúrate de que la ruta sea correcta

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // contexto para almacenar token y rol

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://backend-toraxview.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      login(data.access_token, data.role); // almacena en el contexto
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
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
          {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
