// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PlanesPage from "./pages/PlanesPage";
import ProyectosPage from "./pages/ProyectosPage";
import CalendarioPage from "./pages/CalendarioPage";
import WelcomePage from "./pages/WelcomePage";
import AnaliticaPage from "./pages/AnaliticaPage";
import PremiumPage from "./pages/PremiumPage"; // Esta es la que usamos para el dashboard premium
import ProyectosPremiumPage from "./pages/ProyectosPremiumPage"; 
import "./App.css"; // Importa tus estilos globales de App si los tienes

function App() {
  return (
    <Router>
      {/* El div con className="App" es opcional si no le das estilos específicos en App.css */}
      <div className="App"> 
        <Routes>
          {/* Rutas Estándar/Generales */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/planes" element={<PlanesPage />} />
          
          {/* Ruta para proyectos normales (con parámetro opcional para ver/editar) */}
          <Route path="/proyectos" element={<ProyectosPage />} /> {/* Ruta base */}
          <Route path="/proyectos/:proyectoId" element={<ProyectosPage />} /> {/* Ruta con ID */}
          
          <Route path="/calendario" element={<CalendarioPage />} />
          <Route path="/welcome" element={<WelcomePage />} /> 
          <Route path="/analitica" element={<AnaliticaPage />} />
          
          {/* Rutas Premium */}
          <Route path="/premium" element={<PremiumPage />} /> {/* Dashboard específico para Premium */}
          
          {/* Ruta para proyectos premium (con parámetro opcional para ver/editar) */}
          <Route path="/proyectos-premium" element={<ProyectosPremiumPage />} /> {/* Ruta base */}
          <Route path="/proyectos-premium/:proyectoId" element={<ProyectosPremiumPage />} /> {/* Ruta con ID */}
          
          {/* Considera una ruta Not Found al final para manejar URLs incorrectas */}
          {/* <Route path="*" element={<div><h1>404 - Página No Encontrada</h1></div>} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;