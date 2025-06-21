import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import "./PremiumPage.css"; 

const PremiumPage = () => {
  const [totalProyectos, setTotalProyectos] = useState(0);
  const [totalTareas, setTotalTareas] = useState(0);
  const [fechasProximas, setFechasProximas] = useState(0);
  const [proyectos, setProyectos] = useState([]);
  const navigate = useNavigate();

  const loadAndProcessData = useCallback(() => {
    const loadedProjects = JSON.parse(localStorage.getItem("proyectos") || "[]");
    setProyectos(loadedProjects);
    setTotalProyectos(loadedProjects.length);

    let pTasks = 0;
    let uDeadlines = 0;
    if (Array.isArray(loadedProjects)) {
      loadedProjects.forEach(p => {
        if (p && p.tareas && Array.isArray(p.tareas)) {
          p.tareas.forEach(t => {
            if (t && t.estado !== 'Completada') {
              pTasks++;
              const fechaLimiteDeTarea = t.fechaLimiteTarea || t.fechaLimite;
              if (fechaLimiteDeTarea) { 
                const dl = new Date(fechaLimiteDeTarea);
                const today = new Date();
                const sevenDays = new Date();
                sevenDays.setDate(today.getDate() + 7);
                if (dl instanceof Date && !isNaN(dl) && dl >= today && dl <= sevenDays) {
                  uDeadlines++;
                }
              }
            }
          });
        }
      });
    }
    setTotalTareas(pTasks); 
    setFechasProximas(uDeadlines);
  }, []);


  useEffect(() => {
    loadAndProcessData(); 
    
    window.addEventListener('storage', loadAndProcessData);
    window.addEventListener('focus', loadAndProcessData);
    window.addEventListener('proyectosActualizados', loadAndProcessData);

    return () => {
      window.removeEventListener('storage', loadAndProcessData);
      window.removeEventListener('focus', loadAndProcessData);
      window.removeEventListener('proyectosActualizados', loadAndProcessData);
    };
  }, [loadAndProcessData]); 

  const handleNavigateToPremiumProjects = () => {
    navigate("/proyectos-premium"); 
  };

  const handleNavigateToProjectDetails = (index) => {
    navigate(`/proyectos-premium/${index}`); 
  };

  return (
    <div className="page-container"> 
      <Navbar /> 
      <main> 
        <div className="main-container"> 
          <div className="premium-badge-section">
            <div className="premium-badge">⭐ USUARIO PREMIUM ⭐</div>
          </div>

          <section className="dashboard-section">
            <div className="dashboard-grid">
              <div className="dashboard-card premium-card">
                <h2>Proyectos Activos</h2>
                <p>{totalProyectos} {totalProyectos === 1 ? 'proyecto' : 'proyectos'} en curso</p>
                <p className="premium-feature">✨ Sin límites</p>
              </div>
              <div className="dashboard-card premium-card">
                <h2>Tareas Pendientes</h2>
                <p>{totalTareas} {totalTareas === 1 ? 'tarea' : 'tareas'} sin completar</p>
                <p className="premium-feature">✨ Notificaciones premium</p>
              </div>
              <div className="dashboard-card premium-card">
                <h2>Próximas Fechas Límite</h2>
                <p>{fechasProximas} {fechasProximas === 1 ? 'tarea con fecha' : 'tareas con fechas'} próximas</p>
                <p className="premium-feature">✨ Alertas prioritarias</p>
              </div>
            </div>
          </section>

          <section className="projects-section">
            <h2>Lista de Proyectos Premium</h2>
            <div className="table-container">
              <table className="projects-table">
                <thead className="premium-table-header">
                  <tr>
                    <th>Nombre del Proyecto</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de Vencimiento</th>
                    <th>Importancia</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="no-projects">
                        No hay proyectos registrados
                      </td>
                    </tr>
                  ) : (
                    proyectos.map((proyecto, index) => (
                      <tr key={index}>
                        <td className="project-name">{proyecto.nombre}</td>
                        <td>{proyecto.fechaInicio}</td>
                        <td>{proyecto.fechaLimite}</td>
                        <td>
                          <span className={`priority-badge priority-${(proyecto.importancia || 'baja').toLowerCase()}`}>
                            {proyecto.importancia}
                          </span>
                        </td>
                        <td className="actions">
                          <button onClick={() => handleNavigateToProjectDetails(index)} className="btn-view">Ver</button>
                          <button onClick={() => handleNavigateToProjectDetails(index)} className="btn-edit">Editar</button>
                          {/* La lógica de eliminar necesitaría un modal de confirmación aquí */}
                          <button onClick={() => alert('Funcionalidad de eliminar pendiente en esta vista.')} className="btn-delete">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="add-project-section">
              <button onClick={handleNavigateToPremiumProjects} className="btn-add-premium-project">
                Agregar Proyecto Premium
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer /> 
    </div>
  );
};

export default PremiumPage;