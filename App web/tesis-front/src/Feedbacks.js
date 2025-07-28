import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css";
import { useAuth } from "./context/AuthContext";

export default function Feedbacks() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const token = auth?.token;
  const userRole = auth?.role;

  const [radiologos, setRadiologos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [abiertos, setAbiertos] = useState({});
  const [activoId, setActivoId] = useState(null);

  const toggleAbierto = (key) => {
    setAbiertos((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/radiologos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRadiologos(data);
        } else {
          setRadiologos([]);
        }
      });
  }, [token]);

  const cargarRegistros = (id) => {
    setActivoId(id);
    fetch(`http://localhost:8000/registros_por_radiologo/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRegistros(data);
        } else {
          setRegistros([]);
        }
      });
  };

  return (
    <div className="dashboard-wrapper">
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
            {userRole === "radiologo" && (
              <li onClick={() => navigate("/resultados")}>Resultados</li>
            )}
            {userRole === "administrador" && (
              <>
                <li className="active">Resultados por Radiologo</li>
                <li onClick={() => navigate("/usuarios")}>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        <div className="image-area">
          <h2>REGISTROS POR RADIÓLOGO</h2>

          <div style={{ marginBottom: "20px" }}>
            <h4>Seleccione un radiólogo:</h4>
              <ul className="radiologos-lista">
                {radiologos.map((r) => (
                  <li key={r.id}>
                    <button
                      className={r.id === activoId ? "activo" : ""}
                      onClick={() => cargarRegistros(r.id)}
                    >
                      {r.username}
                    </button>
                  </li>
                ))}
              </ul>

          </div>

          {registros.length > 0 ? (
            <div className="resultados-grid">
              {registros.map((registro) => {
                const isOpen = abiertos[registro.key] ?? false;
                return (
                  <div key={registro.key} className="registro-card">
                    <h3 onClick={() => toggleAbierto(registro.key)} style={{ cursor: "pointer" }}>
                      {isOpen ? "−" : "+"} ID:{" "}
                      <span className="registro-id">{registro.key}</span>
                    </h3>

                    {isOpen && (
                      <>
                        <div className="registro-info-grid">
                          <p><strong>Fecha de Inferencia:</strong> {registro.inference_date}</p>
                          <p><strong>Género:</strong> {registro.gender}</p>
                          <p><strong>Lugar:</strong> {registro.city}, {registro.parish}, {registro.canton}</p>
                          <p><strong>Precisión:</strong> {(registro.precision * 100).toFixed(2)}%</p>
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
                            <tr><th>Enfermedad</th><th>Probabilidad</th></tr>
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

                        <p><strong>Observaciones:</strong> {registro.feedback || "Sin observaciones."}</p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          ) : activoId ? (
            <p>No hay registros disponibles para este radiólogo.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
