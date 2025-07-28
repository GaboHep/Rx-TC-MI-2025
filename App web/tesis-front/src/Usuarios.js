import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css";
import { useAuth } from "./context/AuthContext";

export default function Usuarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();
  const token = auth?.token;
  const userRole = auth?.role;

  const [radiologos, setRadiologos] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/radiologos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setRadiologos);
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8000/radiologos/${editingId}`
      : "http://localhost:8000/radiologos";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then(() => {
        setForm({ username: "", password: "" });
        setEditingId(null);
        return fetch("http://localhost:8000/radiologos", {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => res.json())
      .then(setRadiologos);
  };

  const handleDelete = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    fetch(`http://localhost:8000/radiologos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }).then(() =>
      setRadiologos((prev) => prev.filter((r) => r.id !== id))
    );
  };

  const handleEdit = (rad) => {
    setForm({ username: rad.username, password: "" });
    setEditingId(rad.id);
  };

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
            {userRole === "radiologo" && (
              <li onClick={() => navigate("/resultados")}>Resultados</li>
            )}
            {userRole === "administrador" && (
              <>
                <li onClick={() => navigate("/feedbacks")}>Feedbacks</li>
                <li onClick={() => navigate("/usuarios")}>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        {/* CRUD Radiologos */}
        <div className="image-area">
          <h2 className="crud-title">CRUD DE USUARIOS</h2>

          <form onSubmit={handleSubmit} className="form-section">
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={form.username}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm({ username: "", password: "" });
                }}
              >
                Cancelar
              </button>
            )}
          </form>

          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {radiologos.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.username}</td>
                  <td>
                    <button onClick={() => handleEdit(r)}>Editar</button>
                    <button onClick={() => handleDelete(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
