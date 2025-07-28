import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logoEspol from "./assets/logoEspol.png";
import "./Dashboard.css";
import { useAuth } from "./context/AuthContext"; // 👈 Importar el contexto

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth(); // 👈 Obtener auth y logout del contexto
  const userRole = auth?.role;

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [precision, setPrecision] = useState(null);
  const [progress, setProgress] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [feedback, setFeedback] = useState("");

  const [formData, setFormData] = useState({
    key: crypto.randomUUID(),
    birthDate: "",
    gender: "",
    city: "",
    parish: "",
    canton: "",
    inferenceDate: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [registros, setRegistros] = useState([]);

  const handleGuardar = () => {
    const nuevoRegistro = {
      id: formData.key,
      fecha: formData.inferenceDate,
      datos: formData,
      resultados: resultados,
      precision: precision,
      feedback: feedback,
      image: image,
    };
    setRegistros(prev => [...prev, nuevoRegistro]);
    console.log("📦 Registro guardado temporalmente:", nuevoRegistro);

    setImage(null);
    setResultados([]);
    setPrecision(null);
    setFeedback("");
    setFormData({
      key: crypto.randomUUID(),
      birthDate: "",
      gender: "",
      city: "",
      parish: "",
      canton: "",
      inferenceDate: new Date().toISOString().split("T")[0],
    });
    setShowResults(false);
    setLoading(false);
    setProgressValue(0);
    navigate("/dashboard");
  };



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

  //CODIGO PARA LA SECCIÓN DE LA BARRA DE CARGA
  const simulateProgress = () => {
    setProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      current += 5;
      if (current >= 95) {
        clearInterval(interval);
        return;
      }
      setProgress(current);
    }, 100); // velocidad deseada (ajustable)
    return interval;
  };



  //PETICION AL BACKEND PARA LA PREDICCIÓN
  const handleDiagnose = async () => {
    if (!image) return;

    setLoading(true);
    setShowResults(false);
    setProgressValue(0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      // Simular hasta el 90%
      if (progress < 90) {
        progress += 1;
        setProgressValue(progress);
      }
    }, 20);

  try {
    const formData = new FormData();
    const blob = await fetch(image).then(res => res.blob());
    formData.append("file", blob, "image.png");

    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    // 🔁 Completa del 90% al 100% tras recibir respuesta
    clearInterval(progressInterval);

    const completeProgress = async () => {
      while (progress < 100) {
        progress += 1;
        setProgressValue(progress);
        await new Promise(res => setTimeout(res, 20)); // velocidad final
      }
    };

    await completeProgress(); // Esperar 90→100 antes de mostrar resultados

    setResultados(data.predictions || []);
    setPrecision(data.precision || null);
    setShowResults(true);

  } catch (error) {
    console.error("Error en la predicción:", error);
    alert("Ocurrió un error al procesar la imagen.");
  } finally {
    setLoading(false);
  }
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
          <button className="logout-button" onClick={() => {
            logout(); // 👈 ahora usa el contexto
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
                  <li onClick={() => navigate("/feedbacks")}>Feedbacks</li> {/* si luego lo implementas */}
                  <li onClick={() => navigate("/usuarios")}>Usuarios</li>
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

          {/* PREVISUALIZACIÓN */}

          {image && !loading && !showResults && (
            <>
            <div className="image-form-container">
              <img src={image} alt="preview" className="preview-image" />

              <div className="form-metadata">
                <h3>Información del paciente</h3>

                <label>Fecha de nacimiento:</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />

                <label>Género:</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>

                <label>Ciudad:</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} />

                <label>Parroquia:</label>
                <input type="text" name="parish" value={formData.parish} onChange={handleInputChange} />

                <label>Cantón:</label>
                <input type="text" name="canton" value={formData.canton} onChange={handleInputChange} />
              </div>
            </div>


              {/* BOTONES PREVISUALIZACIÓN */}
              <div className="button-group">
                <button className="diagnose-button" style={{ position: "relative", overflow: "hidden" }}>
                  Volver a seleccionar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      opacity: 0,
                      width: "100%",
                      height: "100%",
                      cursor: "pointer"
                    }}
                  />
                </button>
                <button className="diagnose-button" onClick={handleDiagnose}>
                  Analizar Imagen
                </button>
              </div>
            </>
          )}

          {/* LOADING BAR */}

          {loading && (
            <div className="results-container">
              <img src={image} alt="preview" className="preview-image" />
              <div className="progress-container">
                <progress value={progressValue} max={100} className="progress-bar"></progress>
<span className="progress-label">{progressValue}%</span>
              </div>
            </div>
          )}

          {/* TABLA DE RESULTADOS */}
          
            {showResults && (
            <div className="results-container">
                <div className="result-section">
                <img src={image} alt="preview" className="preview-image" />

                <div className="result-column">
                    <div className="result-box">
                        <h3>Resultados</h3>
                    <div className="result-disease-list">
                       
                      {Array.isArray(resultados) && (
                      <table className="result-table">
                        <thead>
                          <tr>
                            <th>Enfermedad</th>
                            <th>Probabilidad</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.map((item, index) => (
                            <tr key={index}>
                              <td>{item.label}</td>
                              <td>{(item.probability * 100).toFixed(2)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                      {precision !== null && (
                        <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
                          Precisión general del modelo: {(precision * 100).toFixed(2)}%
                        </p>
                      )}

                    </div>

                    <div className="feedback-box">
                        <h3>Observaciones</h3>
                       <textarea
                          className="feedback-textarea"
                          placeholder="Escriba su feedback aquí..."
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <button className="send-feedback-button" onClick={handleGuardar}>Guardar</button>
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
