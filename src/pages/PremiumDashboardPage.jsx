import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PremiumDashboardPage.css'; 

function PremiumDashboardPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState(() => {
    const p = localStorage.getItem('proyectos');
    return p ? JSON.parse(p) : [];
  });
  const [activeProjectsCount, setActiveProjectsCount] = useState(0);
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [upcomingDeadlinesCount, setUpcomingDeadlinesCount] = useState(0);

  // useEffect para la notificación premium (si se decide re-implementar)
  
  useEffect(() => {
    const premiumNotificationShown = sessionStorage.getItem('premiumNotificationShown');
    if (localStorage.getItem('userPlan') === 'premium') {
      if (!premiumNotificationShown) {
        Swal.fire({
          title: '¡Notificaciones Premium Activadas!',
          html: <p>Como usuario Premium, recibirás recordatorios y alertas prioritarias...</p>,
          icon: 'info',
          confirmButtonText: '¡Entendido!',
          toast: true,
          position: 'top-end',
          showConfirmButton: true, 
          customClass: { popup: 'premium-toast-notification' }
        });
        sessionStorage.setItem('premiumNotificationShown', 'true');
      }
    }
  }, []);


  const loadAndProcessProjects = useCallback(() => {
    const loadedProjects = JSON.parse(localStorage.getItem('proyectos')) || [];
    setProjects(loadedProjects); 
    setActiveProjectsCount(loadedProjects.length);

    let pTasks = 0, uDeadlines = 0;
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
  
  const handleAddProjectClick = () => {
    navigate('/proyectos-premium'); 
  };
  
  const navigateToProjectDetails = (index) => {
    navigate(`/proyectos-premium/${index}`); 
  };
  
  return (
    <>
      <Navbar /> 
      <main className="premium-dashboard-main-content">
        <div className="premium-dashboard-container">
          <header className="premium-dashboard-header">
            <h1>Dashboard Premium</h1>
            <p>¡Bienvenido a tu espacio exclusivo con todas las funcionalidades!</p>
          </header>

          <section id="dashboard-premium" className="content-section">
            <div className="summary-cards-container-premium">
              <div className="summary-card-premium">
                <h2>Proyectos Activos</h2>
                <p>{activeProjectsCount} {activeProjectsCount === 1 ? 'proyecto' : 'proyectos'}</p>
              </div>
              <div className="summary-card-premium">
                <h2>Tareas Pendientes</h2>
                <p>{pendingTasksCount} {pendingTasksCount === 1 ? 'tarea' : 'tareas'}</p>
              </div>
              <div className="summary-card-premium">
                <h2>Próximas Fechas Límite</h2>
                <p>{upcomingDeadlinesCount} {upcomingDeadlinesCount === 1 ? 'fecha próxima' : 'fechas próximas'}</p>
              </div>
              <div className="summary-card-premium"> 
                <h2>Beneficio Exclusivo</h2>
                <p>¡Proyectos Ilimitados!</p>
              </div>
            </div>
          </section>

          <section id="proyectos-lista-premium" className="content-section projects-table-container-premium">
            <h2>Tu Lista de Proyectos</h2>
            <table className="projects-table-premium">
              <thead>
                <tr>
                  <th>Nombre del Proyecto</th><th>Fecha de Inicio</th><th>Fecha de Vencimiento</th><th>Importancia</th><th>Tareas</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.length > 0 ? (
                  projects.map((proyecto, index) => (
                    <tr key={proyecto.id || index}>
                      <td>{proyecto.nombre || 'N/A'}</td><td>{proyecto.fechaInicio || 'N/A'}</td><td>{proyecto.fechaLimite || 'N/A'}</td><td>{proyecto.importancia || 'N/A'}</td>
                      <td>
                        {proyecto.tareas && proyecto.tareas.length > 0 
                            ? `${proyecto.tareas.length} tarea${proyecto.tareas.length === 1 ? '' : 's'}` 
                            : 'Sin tareas'}
                        <button 
                            onClick={() => navigateToProjectDetails(index)} 
                            className="view-tasks-button" 
                            style={{marginLeft: '10px', fontSize: '0.8em', padding: '3px 6px', backgroundColor: '#54a0ff', color: 'white', border:'none', borderRadius:'4px', cursor:'pointer'}}
                        >
                            Ver/Gestionar
                        </button>
                      </td>
                      <td>
                        <button 
                            onClick={() => navigateToProjectDetails(index)} 
                            className="edit-button-premium" 
                        >
                            Editar Detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      No tienes proyectos creados. ¡Comienza ahora!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <button className="add-project-button-premium" onClick={handleAddProjectClick}>
              Agregar Nuevo Proyecto
            </button>
          </section>
        </div>
      </main>
      <footer className="premium-dashboard-footer">
        <p>©PLANIFY PREMIUM - 2024 (EEMSJ)</p>
      </footer>
    </>
  );
}

export default PremiumDashboardPage;