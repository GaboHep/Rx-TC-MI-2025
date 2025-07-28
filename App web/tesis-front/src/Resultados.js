import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css"; // Reutiliza el mismo CSS del Dashboard
import { useAuth } from "./context/AuthContext";

export default function Resultados({ registros = [] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth(); // ⬅️ nuevo
  const userRole = auth?.role;        // ⬅️ nuevo

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <img src={logoEspol} alt="ESPOL" className="espol-logo" />
          <h1 className="header-title">RX - TC</h1>
        </div>
        
        <div className="dashboard-header-right">
          <div className="user-role">
            <span>{userRole === "radiologo" ? "Radiólogo" : "Administrador"}</span>
            <span>👤</span>
          </div>
          <button className="logout-button" onClick={() => {
            logout(); // ⬅️ nuevo
            window.location.href = "/";
          }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li
              onClick={() => {
                if (location.pathname === "/dashboard") {
                  window.location.reload(); // fuerza recarga si ya estás ahí
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              Análisis
            </li>

            {userRole === "radiologo" && (
              <li onClick={() => navigate("/resultados")}>Resultados</li>
            )}

            {userRole === "administrador" && (
              <>
                <li>Feedbacks</li>
                <li>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        <div className="image-area">
          <h2 style={{ marginBottom: "1rem" }}>Historial de Resultados</h2>
          {registros.length === 0 ? (
            <p>No hay registros guardados aún.</p>
          ) : (
            <div className="resultados-list">
              {registros.map((registro, idx) => (
                <div key={idx} className="registro-card">
                  <h3>ID: {registro.id}</h3>
                  <p><strong>Fecha de Inferencia:</strong> {registro.fecha}</p>
                  <p><strong>Género:</strong> {registro.datos.gender}</p>
                  <p><strong>Lugar:</strong> {registro.datos.city}, {registro.datos.parish}, {registro.datos.canton}</p>
                  <img
                    src={registro.image}
                    alt="preview"
                    className="preview-image"
                    style={{ maxWidth: "100px", margin: "10px 0" }}
                  />
                  <h4>Resultados:</h4>
                  <ul>
                    {registro.resultados.map((r, i) => (
                      <li key={i}>{r.label}: {(r.probability * 100).toFixed(2)}%</li>
                    ))}
                  </ul>
                  <p><strong>Observaciones:</strong> {registro.feedback || "Sin observaciones."}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
