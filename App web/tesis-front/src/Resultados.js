import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css";
import { useAuth } from "./context/AuthContext";

export default function Resultados() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const userRole = auth?.role;
  const token = auth?.token;

  const [registros, setRegistros] = useState([]);
  const [abiertos, setAbiertos] = useState({});

  const toggleAbierto = (key) => {
    setAbiertos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!token) return;
    fetch("https://backend-toraxview.onrender.com/mis_registros", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegistros(data);
        } else {
          console.warn("Respuesta inesperada del backend:", data);
          setRegistros([]);
        }
      })
      .catch((err) => console.error("Error al cargar registros:", err));
  }, [token]);

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
          <button
            className="logout-button"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
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
                  window.location.reload();
                } else {
                  navigate("/dashboard");
                }
              }}
            >
              Análisis
            </li>

            {userRole === "radiologo" && <li className="active">Resultados</li>}

            {userRole === "administrador" && (
              <>
                <li onClick={() => navigate("/feedbacks")}>Feedbacks</li>
                <li onClick={() => navigate("/usuarios")}>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        <div className="image-area">
          <h2 style={{ marginBottom: "1rem" }}>HISTORIAL DE RESULTADOS</h2>

          {/* Protección robusta del render */}
          {Array.isArray(registros) && registros.length === 0 ? (
            <p>No hay registros guardados aún.</p>
          ) : Array.isArray(registros) ? (
            <div className="resultados-grid">
              {registros.map((registro) => {
                const isOpen = abiertos[registro.key] ?? false;

                return (
                  <div key={registro.key} className="registro-card">
                    <h3
                      onClick={() => toggleAbierto(registro.key)}
                      style={{ cursor: "pointer" }}
                    >
                      {isOpen ? "−" : "+"} ID:{" "}
                      <span className="registro-id">{registro.key}</span>
                    </h3>

                    {isOpen && (
                      <>
                        <div className="registro-info-grid">
                          <p>
                            <strong>Fecha de Inferencia:</strong>{" "}
                            {registro.inference_date}
                          </p>
                          <p>
                            <strong>Género:</strong> {registro.gender}
                          </p>
                          <p>
                            <strong>Lugar:</strong> {registro.city},{" "}
                            {registro.parish}, {registro.canton}
                          </p>
                          <p>
                            <strong>Precisión:</strong>{" "}
                            {(registro.precision * 100).toFixed(2)}%
                          </p>
                        </div>

                        <img
                          src={registro.image}
                          alt="Radiografía"
                          className="preview-image"
                          style={{ maxWidth: "120px", margin: "14px 0" }}
                        />

                        <h4 style={{ marginTop: "10px" }}>Resultados:</h4>
                        <table className="resultados-tabla">
                          <thead>
                            <tr>
                              <th>Enfermedad</th>
                              <th>Probabilidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {JSON.parse(registro.resultados).map((r, i) => (
                              <tr key={i}>
                                <td>{r.label}</td>
                                <td>{(r.probability * 100).toFixed(2)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <p>
                          <strong>Observaciones:</strong>{" "}
                          {registro.feedback || "Sin observaciones."}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p>Error: los datos de registros no son válidos.</p>
          )}
        </div>
      </div>
    </div>
  );
}
