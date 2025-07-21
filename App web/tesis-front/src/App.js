import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./landingPage";
import LoginPage from "./LoginPage"; // Puedes crear esta luego
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
