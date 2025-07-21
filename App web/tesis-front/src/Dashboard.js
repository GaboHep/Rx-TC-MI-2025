import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [userType, setUserType] = useState("radiologo");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const location = useLocation();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setShowResults(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <img src={logoEspol} alt="ESPOL" className="espol-logo" />
          <h1 className="header-title">RX - TC</h1>
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
            <li onClick={() => {
                if (location.pathname === "/dashboard") {
                window.location.reload(); // fuerza recarga si ya estás ahí
                } else {
                navigate("/dashboard");
                }
            }}>Diagnósticos</li>

            {userType === "radiologo" && <li onClick={() => navigate("/pacientes")}>Pacientes</li>}
            {userType === "administrador" && (
              <>
                <li>Feedbacks</li>
                <li>Usuarios</li>
              </>
            )}
          </ul>
        </nav>

        <div className="image-area">
          {!image && (
            <>
              <label className="upload-button">
                Seleccionar imagen
                <input type="file" accept="image/*" hidden onChange={handleImageSelect} />
              </label>
              <div className="upload-box">
                <p>
                  <span style={{ fontSize: "30px" }}>⬇️</span>
                  <br />Puede arrastrar y soltar archivos aquí para añadirlos
                </p>
              </div>
            </>
          )}

          {image && !loading && !showResults && (
            <>
              <img src={image} alt="preview" className="preview-image" />
              <button className="diagnose-button" onClick={handleDiagnose}>
                Cargar imagen
              </button>
            </>
          )}

            {loading && (
            <div className="results-container">
                <img src={image} alt="preview" className="preview-image" />
                <div className="progress-container">
                <progress value={64} max={100} className="progress-bar"></progress>
                <span className="progress-label">64%</span>
                </div>
            </div>
            )}

            {showResults && (
            <div className="results-container">
                <div className="result-section">
                <img src={image} alt="preview" className="preview-image" />

                <div className="result-column">
                    <div className="result-box">
                        <h3>Resultados</h3>
                    <div className="result-disease-list">
                        
                        <ul>
                        <li>Atelectasias..................... 0%</li>
                        <li>Cardiomegalia.................. 20%</li>
                        <li>Efusión......................... 0%</li>
                        <li>Enfisema....................... 30%</li>
                        <li>Fibrosis......................... 0%</li>
                        <li>Infiltración...................... 0%</li>
                        <li>Masa............................ 40%</li>
                        <li>Sano............................. 0%</li>
                        <li>Nódulo............................ 0%</li>
                        <li>Engrosamiento pleural.......... 60%</li>
                        <li>Neumonía.......................... 0%</li>
                        <li>Neumotórax........................ 0%</li>
                        <li>Tuberculosis.................... 0%</li>
                        </ul>
                    </div>

                    <div className="feedback-box">
                        <h3>Feedback</h3>
                        <textarea
                        className="feedback-textarea"
                        placeholder="Escriba su feedback aquí..."
                        />
                        <button className="send-feedback-button">Enviar</button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  );
}
