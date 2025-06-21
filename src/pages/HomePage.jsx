import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => {
    const proyectosGuardados = localStorage.getItem('proyectos');
    return proyectosGuardados ? JSON.parse(proyectosGuardados) : [];
  });
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [upcomingDeadlinesCount, setUpcomingDeadlinesCount] = useState(0);

  const loadAndProcessProjects = useCallback(() => {
    const loadedProjects = JSON.parse(localStorage.getItem('proyectos')) || [];
    setProjects(loadedProjects); 
    setActiveProjectsCount(loadedProjects.length);

    let pTasks = 0;
    let uDeadlines = 0;
    if(Array.isArray(loadedProjects)){
      loadedProjects.forEach(p => { 
        if(p && p.tareas && Array.isArray(p.tareas)){
          p.tareas.forEach(t => { 
            if(t && t.estado !== 'Completada'){
              pTasks++; 
              if(t.fechaLimiteTarea){
                const dl = new Date(t.fechaLimiteTarea); 
                const today = new Date(); 
                const sevenDays = new Date(); 
                sevenDays.setDate(today.getDate()+7); 
                if(dl instanceof Date && !isNaN(dl) && dl >= today && dl <= sevenDays){
                  uDeadlines++;
                }
              }
            }
          });
        }
      });
    }
    setPendingTasksCount(pTasks); 
    setUpcomingDeadlinesCount(uDeadlines);
  }, []); 

  useEffect(() => {
    loadAndProcessProjects(); 
    const handleUpdates = () => loadAndProcessProjects();
    window.addEventListener('storage', handleUpdates);
    window.addEventListener('focus', handleUpdates);
    window.addEventListener('proyectosActualizados', handleUpdates);
    return () => { 
      window.removeEventListener('storage', handleUpdates); 
      window.removeEventListener('focus', handleUpdates); 
      window.removeEventListener('proyectosActualizados', handleUpdates);
    };
  }, [loadAndProcessProjects]); 

  const handleAddProjectClick = () => navigate('/proyectos'); 
  const navigateToProjectDetails = (index) => navigate(`/proyectos/${index}`); 
  

  return (
      <>
      <Navbar /> {}
      <main className="homepage-main-content">
          <div className="homepage-container">
            <section id="dashboard" className="content-section">
                <div className="summary-cards-container">
                  <div className="summary-card">
                    <h2>Proyectos Activos</h2>
                    <p>{activeProjectsCount} {activeProjectsCount === 1 ? 'proyecto en curso' : 'proyectos en curso'}</p>
                  </div>
                  <div className="summary-card">
                    <h2>Tareas Pendientes</h2>
                    <p>{pendingTasksCount} {pendingTasksCount === 1 ? 'tarea sin completar' : 'tareas sin completar'}</p>
                  </div>
                  <div className="summary-card">
                    <h2>Próximas Fechas Límite</h2>
                    <p>{upcomingDeadlinesCount} {upcomingDeadlinesCount === 1 ? 'tarea con fecha próxima' : 'tareas con fechas próximas'}</p>
                  </div>
                </div>
            </section>
            <section id="proyectos-lista" className="content-section projects-table-container">
                <h2>Lista de Proyectos</h2>
                <table className="projects-table">
                <thead>
                  <tr>
                    <th>Nombre del Proyecto</th>
                    <th>Fecha de Inicio</th>
                    <th>Fecha de Vencimiento</th>
                    <th>Importancia</th>
                    <th>Tareas</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                    {projects.length > 0 ? ( 
                      projects.map((proyecto, index) => (
                        <tr key={proyecto.id || index}> 
                          <td>{proyecto.nombre || 'N/A'}</td>
                          <td>{proyecto.fechaInicio || 'N/A'}</td>
                          <td>{proyecto.fechaLimite || 'N/A'}</td>
                          <td>{proyecto.importancia || 'N/A'}</td>
                          <td> 
                            {proyecto.tareas && proyecto.tareas.length > 0 
                                ? `${proyecto.tareas.length} tarea${proyecto.tareas.length === 1 ? '' : 's'}` 
                                : 'Sin tareas'} 
                            <button 
                              onClick={() => navigateToProjectDetails(index)} 
                              className="view-tasks-button" 
                              style={{marginLeft: '10px', fontSize: '0.8em', padding: '3px 6px'}}
                            > 
                              Ver/Gestionar 
                            </button> 
                          </td>
                          <td> 
                            <button 
                              onClick={() => navigateToProjectDetails(index)} 
                              className="edit-button"
                            >
                              Editar Detalles
                            </button> 
                          </td>
                        </tr> 
                      ))
                    ) : ( 
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                          No hay proyectos para mostrar. ¡Empieza agregando uno!
                        </td>
                      </tr>
                    )}
                </tbody>
                </table>
                <button className="add-project-button" onClick={handleAddProjectClick}>
                  Agregar Proyecto
                </button>
            </section>
          </div>
      </main>
      <footer className="homepage-footer">
        <p>©PLANIFY - 2024 (EEMSJ)</p>
      </footer>
      </>
  );
}
export default HomePage;