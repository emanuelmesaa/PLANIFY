// src/pages/ProyectosPremiumPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import './ProyectosPremiumPage.css'; 

function ProyectosPremiumPage() {
  const navigate = useNavigate();
  const { proyectoId } = useParams(); 

  const [proyectos, setProyectos] = useState(() => {
    const p = localStorage.getItem('proyectos');
    return p ? JSON.parse(p) : [];
  });
  
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [showAddProjectForm, setShowAddProjectForm] = useState(true); 
  
  const [nombreP, setNombreP] = useState('');
  const [importanciaP, setImportanciaP] = useState('Alta');
  const [fechaInicioP, setFechaInicioP] = useState('');
  const [fechaLimiteP, setFechaLimiteP] = useState('');
  
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projectToDeleteIndex, setProjectToDeleteIndex] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [projectToAssignTaskIndex, setProjectToAssignTaskIndex] = useState(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDeleteIndices, setTaskToDeleteIndices] = useState({ proyectoIdx: null, tareaIdx: null });

  const [nombreT, setNombreT] = useState('');
  const [asignadoA, setAsignadoAT] = useState('');
  const [fechaLimiteT, setFechaLimiteT] = useState('');
  const [estadoT, setEstadoT] = useState('Pendiente');

  const resetProjectForm = useCallback(() => { 
    setNombreP(''); setImportanciaP('Alta'); setFechaInicioP(''); setFechaLimiteP('');
    setEditingProjectData(null); 
    if (proyectoId) { navigate('/proyectos-premium', { replace: true }); } 
  }, [proyectoId, navigate]);

  useEffect(() => { 
    if (proyectoId !== undefined && proyectos && proyectos[Number(proyectoId)]) { 
      const proyectoAEditar = proyectos[Number(proyectoId)]; 
      if (!editingProjectData || editingProjectData.originalIndex !== Number(proyectoId) || JSON.stringify(editingProjectData.proyecto) !== JSON.stringify(proyectoAEditar)) { 
        setEditingProjectData({ proyecto: proyectoAEditar, originalIndex: Number(proyectoId) }); 
        setNombreP(proyectoAEditar.nombre); 
        setImportanciaP(proyectoAEditar.importancia); 
        setFechaInicioP(proyectoAEditar.fechaInicio); 
        setFechaLimiteP(proyectoAEditar.fechaLimite); 
        setShowAddProjectForm(true); 
      } 
    } else if (proyectoId === undefined && editingProjectData) { 
      resetProjectForm(); 
    } 
  }, [proyectoId, proyectos, editingProjectData, resetProjectForm]); 

  useEffect(() => { 
    localStorage.setItem('proyectos', JSON.stringify(proyectos)); 
    window.dispatchEvent(new CustomEvent('proyectosActualizados')); 
  }, [proyectos]);
  
  const reloadProjectsFromStorage = useCallback(() => { 
    const p = localStorage.getItem('proyectos'); 
    const loaded = p ? JSON.parse(p) : []; 
    setProyectos(prev => { if (JSON.stringify(prev) !== JSON.stringify(loaded)) return loaded; return prev; }); 
  }, []);

  useEffect(() => { 
    window.addEventListener('storage', reloadProjectsFromStorage); 
    window.addEventListener('focus', reloadProjectsFromStorage); 
    return () => { 
      window.removeEventListener('storage', reloadProjectsFromStorage); 
      window.removeEventListener('focus', reloadProjectsFromStorage); 
    } 
  }, [reloadProjectsFromStorage]);

  const handleProjectSubmit = (e) => { e.preventDefault(); if (!nombreP || !fechaInicioP || !fechaLimiteP) { alert('Por favor, completa todos los campos del proyecto.'); return; } const proyectoActualizado = { nombre: nombreP, importancia: importanciaP, fechaInicio: fechaInicioP, fechaLimite: fechaLimiteP, tareas: editingProjectData ? editingProjectData.proyecto.tareas : [], }; if (editingProjectData) { const tempProyectos = [...proyectos]; tempProyectos[editingProjectData.originalIndex] = proyectoActualizado; setProyectos(tempProyectos); } else { setProyectos(prevProyectos => [...prevProyectos, proyectoActualizado]); } resetProjectForm(); };
  const handleEditProjectClickDesdeTabla = (proyecto, index) => { navigate(`/proyectos-premium/${index}`); };
  const openDeleteProjectModal = (index) => { setProjectToDeleteIndex(index); setShowDeleteProjectModal(true); };
  const confirmDeleteProject = () => { if (projectToDeleteIndex !== null) { setProyectos(prev => prev.filter((_, idx) => idx !== projectToDeleteIndex)); setShowDeleteProjectModal(false); setProjectToDeleteIndex(null); }};
  const openAssignTaskModal = (proyectoIndex) => { setProjectToAssignTaskIndex(proyectoIndex); setNombreT(''); setAsignadoAT(''); setFechaLimiteT(''); setEstadoT('Pendiente'); setShowAssignTaskModal(true); };
  const handleAssignTaskSubmit = (e) => { e.preventDefault(); if (projectToAssignTaskIndex !== null && nombreT && asignadoA && fechaLimiteT) { const nuevaTarea = { nombreTarea: nombreT, asignado: asignadoA, fechaLimiteTarea: fechaLimiteT, estado: estadoT }; const updatedProyectos = proyectos.map((proyecto, idx) => idx === projectToAssignTaskIndex ? { ...proyecto, tareas: [...(proyecto.tareas || []), nuevaTarea] } : proyecto ); setProyectos(updatedProyectos); setShowAssignTaskModal(false); setProjectToAssignTaskIndex(null); } else { alert('Por favor, complete todos los campos de la tarea.'); }};
  const openDeleteTaskModal = (proyectoIdx, tareaIdx) => { setTaskToDeleteIndices({ proyectoIdx, tareaIdx }); setShowDeleteTaskModal(true); };
  const confirmDeleteTask = () => { const { proyectoIdx, tareaIdx } = taskToDeleteIndices; if (proyectoIdx !== null && tareaIdx !== null) { const updatedProyectos = proyectos.map((p, pIdx) => pIdx === proyectoIdx ? { ...p, tareas: p.tareas.filter((_, tIdx) => tIdx !== tareaIdx) } : p ); setProyectos(updatedProyectos); setShowDeleteTaskModal(false); setTaskToDeleteIndices({ proyectoIdx: null, tareaIdx: null }); }};
  const handleCompleteTask = (proyectoIdx, tareaIdx) => { setProyectos(prev => prev.map((p, pIdx) => pIdx === proyectoIdx ? { ...p, tareas: p.tareas.map((t, tIdx) => tIdx === tareaIdx ? { ...t, estado: t.estado === 'Completada' ? 'Pendiente' : 'Completada' } : t )} : p )); };
  const getTaskStatusClass = (status) => { switch(status?.toLowerCase()){case 'completada': return 'task-status-completed'; case 'en progreso': return 'task-status-in-progress'; case 'pendiente': return 'task-status-pending'; default: return 'task-status-default';}};

  return (
    <div className="proyectos-premium-page-wrapper"> 
      <Navbar /> 
      <header className="page-header premium-header-fullwidth">
        <h1>Gestión de Proyectos <span className="text-highlight-premium">Premium</span></h1>
        <p className="premium-message">
            Organiza, colabora y alcanza tus metas con herramientas exclusivas.
        </p>
      </header>
      <div className="proyectos-premium-content-area"> 
        <main className="proyectos-premium-main-section">
          {showAddProjectForm && (
            <div className="form-container-premium"> 
              <section id="form-section-premium" className="content-section-premium">
                <div className="form-header-premium">
                  <span className="form-icon-premium">💡</span> 
                  <h2>{editingProjectData ? 'Editar Detalles del Proyecto' : 'Iniciar Nuevo Proyecto'}</h2>
                  <p>{editingProjectData ? 'Ajusta la información de tu proyecto.' : 'Define los parámetros clave para tu nuevo emprendimiento.'}</p>
                </div>
                <form onSubmit={handleProjectSubmit} className="project-form-premium">
                  <div className="form-grid-premium">
                    <div className="form-field-premium"> <label htmlFor="nombreP">Título del Proyecto</label> <input type="text" id="nombreP" value={nombreP} onChange={(e) => setNombreP(e.target.value)} placeholder="Ej: Lanzamiento App Móvil Q4" required /> </div>
                    <div className="form-field-premium"> <label htmlFor="importanciaP">Nivel de Prioridad</label> <select id="importanciaP" value={importanciaP} onChange={(e) => setImportanciaP(e.target.value)} required> <option value="Alta">🔴 Urgente</option> <option value="Media">🟡 Importante</option> <option value="Baja">🟢 Normal</option> </select> </div>
                    <div className="form-field-premium"> <label htmlFor="fechaInicioP">Fecha de Comienzo</label> <input type="date" id="fechaInicioP" value={fechaInicioP} onChange={(e) => setFechaInicioP(e.target.value)} required /> </div>
                    <div className="form-field-premium"> <label htmlFor="fechaLimiteP">Fecha Límite Prevista</label> <input type="date" id="fechaLimiteP" value={fechaLimiteP} onChange={(e) => setFechaLimiteP(e.target.value)} required /> </div>
                  </div>
                  <button type="submit" className="submit-button-premium"> {editingProjectData ? 'Actualizar Proyecto' : 'Crear Proyecto'} </button>
                  {editingProjectData && ( <button type="button" onClick={resetProjectForm} className="cancel-edit-button-premium"> Cancelar </button> )}
                </form>
              </section>
            </div>
          )}
          <section id="lista-proyectos-premium" className="content-section-premium table-section-premium">
            <div className="table-header-premium"> <h2><span role="img" aria-label="cohete">🚀</span> Mis Proyectos Activos</h2> <p>Seguimiento y gestión centralizada de todos tus esfuerzos.</p> </div>
            <div className="table-wrapper-premium"> 
              <table className="projects-data-table-premium">
                <thead> <tr> <th>Proyecto</th><th>Inicio</th><th>Límite</th><th>Prioridad</th><th>Tareas Detalladas</th><th>Acciones</th><th>+ Tareas</th> </tr> </thead>
                <tbody>
                  {proyectos.length > 0 ? proyectos.map((proyecto, proyectoIndex) => (
                    <tr key={proyecto.id || proyectoIndex}> 
                      <td data-label="Proyecto">{proyecto.nombre}</td> <td data-label="Inicio">{proyecto.fechaInicio}</td> <td data-label="Límite">{proyecto.fechaLimite}</td> 
                      <td data-label="Prioridad"> <span className={`priority-badge-premium priority-${(proyecto.importancia || 'baja').toLowerCase()}`}> {proyecto.importancia} </span> </td>
                      <td data-label="Tareas Detalladas" className="tasks-cell-premium">
                        {(!proyecto.tareas || proyecto.tareas.length === 0) ? 
                            (<span className="no-tasks-premium">Aún no hay tareas.</span>) : 
                            (<ul> {proyecto.tareas.map((tarea, tareaIndex) => ( <li key={tareaIndex}> <div className="task-info-premium"> <strong>{tarea.nombreTarea || tarea.nombre}</strong> <span className={`task-status-badge ${getTaskStatusClass(tarea.estado)}`}>{tarea.estado}</span> </div> <div className="task-details-premium"> <span>Asignado: {tarea.asignado}</span> <span>Límite: {tarea.fechaLimiteTarea || tarea.fechaLimite}</span> </div> <div className="task-actions-premium"> <button onClick={() => openDeleteTaskModal(proyectoIndex, tareaIndex)} className="btn-task-delete">🗑️ Eliminar</button> <button onClick={() => handleCompleteTask(proyectoIndex, tareaIndex)} className={`btn-task-complete ${tarea.estado === 'Completada' ? 'completed' : ''}`}> {tarea.estado === 'Completada' ? '↩️ Reabrir' : '✔️ Completar'} </button> </div> </li> ))} </ul>)
                        }
                      </td>
                      <td data-label="Acciones" className="project-actions-cell-premium"> <button onClick={() => handleEditProjectClickDesdeTabla(proyecto, proyectoIndex)} className="btn-edit-project-premium">✏️ Editar</button> <button onClick={() => openDeleteProjectModal(proyectoIndex)} className="btn-delete-project-premium">❌ Eliminar</button> </td>
                      <td data-label="+ Tareas"> <button onClick={() => openAssignTaskModal(proyectoIndex)} className="btn-assign-task-premium">➕ Asignar</button> </td>
                    </tr>
                  )) : ( <tr><td colSpan="7" className="no-projects-message-premium">¡Es hora de lanzar tu primer proyecto Premium! ✨</td></tr> )}
                </tbody>
              </table>
            </div> 
          </section> 
        </main>
      </div> 
      {showDeleteProjectModal && ( <div className="modal-overlay"> <div className="modal-content modal-confirm-premium"> <h3>🚫 Confirmar Eliminación</h3> <p>¿Realmente deseas eliminar el proyecto "<strong>{proyectos[projectToDeleteIndex]?.nombre}</strong>"? Esta acción no se puede deshacer.</p> <div className="modal-buttons"> <button onClick={() => setShowDeleteProjectModal(false)} className="btn-modal-cancel-premium">Cancelar</button> <button onClick={confirmDeleteProject} className="btn-modal-confirm-delete-premium">Sí, Eliminar</button> </div> </div> </div> )}
      {showAssignTaskModal && projectToAssignTaskIndex !== null && ( <div className="modal-overlay"> <div className="modal-content assign-task-modal-content modal-form-premium"> <h3>📋 Asignar Nueva Tarea a "{proyectos[projectToAssignTaskIndex]?.nombre}"</h3> <form onSubmit={handleAssignTaskSubmit}> <div><label htmlFor="nombreTModalInPremium">Descripción de la Tarea</label><input type="text" id="nombreTModalInPremium" value={nombreT} onChange={e => setNombreT(e.target.value)} placeholder="Ej: Diseñar wireframes" required /></div> <div><label htmlFor="asignadoATModalInPremium">Responsable</label><input type="text" id="asignadoATModalInPremium" value={asignadoA} onChange={e => setAsignadoAT(e.target.value)} placeholder="Ej: Juan Pérez" required /></div> <div><label htmlFor="fechaLimiteTModalInPremium">Fecha Límite</label><input type="date" id="fechaLimiteTModalInPremium" value={fechaLimiteT} onChange={e => setFechaLimiteT(e.target.value)} required /></div> <div><label htmlFor="estadoTModalInPremium">Estado Inicial</label><select id="estadoTModalInPremium" value={estadoT} onChange={e => setEstadoT(e.target.value)} required><option value="Pendiente">Pendiente</option><option value="En Progreso">En Progreso</option><option value="Completada">Completada</option></select></div> <div className="modal-buttons"> <button type="button" onClick={() => setShowAssignTaskModal(false)} className="btn-modal-cancel-premium">Cancelar</button> <button type="submit" className="btn-modal-submit-premium">Añadir Tarea</button> </div> </form> </div> </div> )}
      {showDeleteTaskModal && taskToDeleteIndices.proyectoIdx !== null && taskToDeleteIndices.tareaIdx !== null && ( <div className="modal-overlay"> <div className="modal-content modal-confirm-premium"> <h3>🗑️ Confirmar Eliminación de Tarea</h3> <p>Proyecto: <strong>{proyectos[taskToDeleteIndices.proyectoIdx]?.nombre}</strong></p> <p>Tarea: <strong>{proyectos[taskToDeleteIndices.proyectoIdx]?.tareas?.[taskToDeleteIndices.tareaIdx]?.nombreTarea || proyectos[taskToDeleteIndices.proyectoIdx]?.tareas?.[taskToDeleteIndices.tareaIdx]?.nombre}</strong></p> <p>¿Estás seguro?</p><div className="modal-buttons"> <button onClick={() => setShowDeleteTaskModal(false)} className="btn-modal-cancel-premium">No, Conservar</button> <button onClick={confirmDeleteTask} className="btn-modal-confirm-delete-premium">Sí, Eliminar Tarea</button> </div> </div> </div> )}
    </div> 
  );
}

export default ProyectosPremiumPage;