import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlanesPage from "./pages/PlanesPage";
import ProyectosPage from "./pages/ProyectosPage";
import CalendarioPage from "./pages/CalendarioPage";
import WelcomePage from "./pages/WelcomePage";
import AnaliticaPage from "./pages/AnaliticaPage";
import PremiumPage from "./pages/PremiumPage";
import ProyectosPremiumPage from "./pages/ProyectosPremiumPage"; 
import "./App.css";

function App() {
  return (
    <Router>
      {}
      <div className="App"> 
        <Routes>
          {}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          
          {}
          <Route path="/proyectos" element={<ProyectosPage />} /> {}
          <Route path="/proyectos/:proyectoId" element={<ProyectosPage />} /> {}
          
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="/welcome" element={<WelcomePage />} /> 
          <Route path="/analitica" element={<AnaliticaPage />} />
          
          {}
          <Route path="/premium" element={<PremiumPage />} /> {}
          
          {}
          <Route path="/proyectos-premium" element={<ProyectosPremiumPage />} /> {}
          <Route path="/proyectos-premium/:proyectoId" element={<ProyectosPremiumPage />} /> {}
          
          {}
          {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;