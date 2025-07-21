import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css"; // Reutiliza el mismo CSS del Dashboard

export default function Pacientes() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [userType] = useState("radiologo");

  const pacientes = [
    {
      id: 1,
      nombre: "John Doe",
      cedula: "1234567890",
      edad: 45,
      genero: "Masculino",
      correo: "john.doe@ejemplo.com",
      telefono: "0999999999",
      direccion: "Av. Siempre Viva 123",
      historial: ["Diagnóstico 1", "Diagnóstico 2"]
    },
       {
      id: 2,
      nombre: "Johana Doe",
      cedula: "179928283742",
      edad: 23,
      genero: "Femenino",
      correo: "joanna@ejemplo.com",
      telefono: "0888888888",
      direccion: "Av. su casa",
      historial: ["Diagnóstico 1", "Diagnóstico 2"]
    }
  ];

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const goToDashboard = () => navigate("/dashboard");

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <img src={logoEspol} alt="ESPOL" className="espol-logo" />
          <h1 className="header-title">Pacientes</h1>
        </div>
        <div className="user-role">
          <span>{userType === "radiologo" ? "Radiólogo" : "Administrador"}</span>
          <span>👤</span>
        </div>
      </header>

      <div className="dashboard-main">
        {/* Sidebar */}
        <nav className="sidebar">
          <ul>
            <li onClick={goToDashboard}>Diagnósticos</li>
            {userType === "radiologo" && <li>Pacientes</li>}
            {userType === "administrador" && (
              <>
                <li>Feedbacks</li>
                <li>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        {/* Contenido de Pacientes */}
        <div className="pacientes-area">
          <button className="upload-button">Registrar nuevo paciente</button>

          <div className="pacientes-list">
            {pacientes.map((paciente) => (
              <div key={paciente.id} className="paciente-card">
                <div className="paciente-header" onClick={() => toggleExpand(paciente.id)}>
                  <span>{paciente.nombre}</span>
                  <span>{expandedId === paciente.id ? "▲" : "▼"}</span>
                </div>
                {expandedId === paciente.id && (
                  <div className="paciente-detalles">
                    <p><strong>Cédula:</strong> {paciente.cedula}</p>
                    <p><strong>Edad:</strong> {paciente.edad}</p>
                    <p><strong>Género:</strong> {paciente.genero}</p>
                    <p><strong>Correo:</strong> {paciente.correo}</p>
                    <p><strong>Teléfono:</strong> {paciente.telefono}</p>
                    <p><strong>Dirección:</strong> {paciente.direccion}</p>
                    <p><strong>Diagnósticos:</strong></p>
                    <ul>
                      {paciente.historial.map((dx, i) => <li key={i}>{dx}</li>)}
                    </ul>
                    <button className="diagnose-button">Ver diagnósticos</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
