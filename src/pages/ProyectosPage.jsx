// src/pages/ProyectosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import './ProyectosPage.css';

const IS_USER_PREMIUM_LOGIC = () => localStorage.getItem('userPlan') === 'premium';
const MAX_PROJECTS_NORMAL_USER = 3;

function ProyectosPage() {
  const navigate = useNavigate();
  const { proyectoId } = useParams();
  const [isCurrentUserPremium, setIsCurrentUserPremium] = useState(IS_USER_PREMIUM_LOGIC());
  const [proyectos, setProyectos] = useState(() => JSON.parse(localStorage.getItem('proyectos')) || []);
  const [editingProjectData, setEditingProjectData] = useState(null);
  const [showAddProjectForm, setShowAddProjectForm] = useState(true);
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [importancia, setImportancia] = useState('Media');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [projectToDeleteIndex, setProjectToDeleteIndex] = useState(null);
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [projectToAssignTaskIndex, setProjectToAssignTaskIndex] = useState(null);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [taskToDeleteIndices, setTaskToDeleteIndices] = useState({ proyectoIdx: null, tareaIdx: null });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [nombreTarea, setNombreTarea] = useState('');
  const [asignadoA, setAsignadoA] = useState('');
  const [fechaLimiteTarea, setFechaLimiteTarea] = useState('');
  const [estadoTarea, setEstadoTarea] = useState('Pendiente');

  const resetProjectForm = useCallback(() => { 
    setNombreProyecto(''); 
    setImportancia('Media'); 
    setFechaInicio(''); 
    setFechaLimite(''); 
    setEditingProjectData(null); 
    if (proyectoId) navigate('/proyectos', { replace: true }); 
  }, [proyectoId, navigate]);

  useEffect(() => { 
    const handlePlanStatusChange = () => setIsCurrentUserPremium(IS_USER_PREMIUM_LOGIC()); 
    window.addEventListener('userPlanChanged', handlePlanStatusChange); 
    window.addEventListener('storage', handlePlanStatusChange); 
    handlePlanStatusChange(); 
    return () => { 
      window.removeEventListener('userPlanChanged', handlePlanStatusChange); 
      window.removeEventListener('storage', handlePlanStatusChange); 
    }; 
  }, []);

  useEffect(() => { 
    const proyectosGuardados = JSON.parse(localStorage.getItem('proyectos')) || []; 
    if (JSON.stringify(proyectosGuardados) !== JSON.stringify(proyectos)) {
        setProyectos(proyectosGuardados);
    }
    if (proyectoId !== undefined && proyectosGuardados[Number(proyectoId)]) { 
      const proyectoAEditar = proyectosGuardados[Number(proyectoId)]; 
      if (!editingProjectData || editingProjectData.originalIndex !== Number(proyectoId) || JSON.stringify(editingProjectData.proyecto) !== JSON.stringify(proyectoAEditar)) { 
        setEditingProjectData({ proyecto: proyectoAEditar, originalIndex: Number(proyectoId) }); 
        setNombreProyecto(proyectoAEditar.nombre); 
        setImportancia(proyectoAEditar.importancia); 
        setFechaInicio(proyectoAEditar.fechaInicio); 
        setFechaLimite(proyectoAEditar.fechaLimite); 
        setShowAddProjectForm(true); 
        window.scrollTo(0, 0); 
      } 
    } else if (proyectoId === undefined && editingProjectData) { 
      resetProjectForm(); 
    } 
  }, [proyectoId, resetProjectForm]);

  useEffect(() => { 
    localStorage.setItem('proyectos', JSON.stringify(proyectos)); 
    window.dispatchEvent(new CustomEvent('proyectosActualizados')); 
  }, [proyectos]);
  
  const handleProjectSubmit = (e) => { e.preventDefault(); if (!nombreProyecto || !fechaInicio || !fechaLimite) { alert('Por favor, completa todos los campos del proyecto.'); return; } if (!isCurrentUserPremium && proyectos.length >= MAX_PROJECTS_NORMAL_USER && editingProjectData === null) { setShowLimitModal(true); return; } const proyectoActualizado = { nombre: nombreProyecto, importancia, fechaInicio, fechaLimite, tareas: editingProjectData ? editingProjectData.proyecto.tareas : [], }; if (editingProjectData) { const tempProyectos = [...proyectos]; tempProyectos[editingProjectData.originalIndex] = proyectoActualizado; setProyectos(tempProyectos); } else { setProyectos(prevProyectos => [...prevProyectos, proyectoActualizado]); } resetProjectForm(); };
  const handleEditProjectClickInterno = (proyecto, index) => navigate(`/proyectos/${index}`);
  const openDeleteProjectModal = (index) => { setProjectToDeleteIndex(index); setShowDeleteProjectModal(true); };
  const confirmDeleteProject = () => { if (projectToDeleteIndex !== null) { setProyectos(prev => prev.filter((_, idx) => idx !== projectToDeleteIndex)); setShowDeleteProjectModal(false); setProjectToDeleteIndex(null); }};
  const openAssignTaskModal = (proyectoIndex) => { setProjectToAssignTaskIndex(proyectoIndex); setNombreTarea(''); setAsignadoA(''); setFechaLimiteTarea(''); setEstadoTarea('Pendiente'); setShowAssignTaskModal(true); };
  const handleAssignTaskSubmit = (e) => { e.preventDefault(); if (projectToAssignTaskIndex !== null && nombreTarea && asignadoA && fechaLimiteTarea) { const nuevaTarea = { nombreTarea, asignado: asignadoA, fechaLimiteTarea, estado: estadoTarea }; const updatedProyectos = proyectos.map((proyecto, idx) => idx === projectToAssignTaskIndex ? { ...proyecto, tareas: [...(proyecto.tareas || []), nuevaTarea] } : proyecto); setProyectos(updatedProyectos); setShowAssignTaskModal(false); setProjectToAssignTaskIndex(null); } else { alert('Por favor, complete todos los campos de la tarea.'); }};
  const openDeleteTaskModal = (proyectoIdx, tareaIdx) => { setTaskToDeleteIndices({ proyectoIdx, tareaIdx }); setShowDeleteTaskModal(true); };
  const confirmDeleteTask = () => { const { proyectoIdx, tareaIdx } = taskToDeleteIndices; if (proyectoIdx !== null && tareaIdx !== null) { const updatedProyectos = proyectos.map((p, pIdx) => { if (pIdx === proyectoIdx) { const currentTasks = Array.isArray(p.tareas) ? p.tareas : []; const nuevasTareas = currentTasks.filter((_, tIdx) => tIdx !== tareaIdx); return { ...p, tareas: nuevasTareas }; } return p; }); setProyectos(updatedProyectos); setShowDeleteTaskModal(false); setTaskToDeleteIndices({ proyectoIdx: null, tareaIdx: null }); }};
  const handleCompleteTask = (proyectoIdx, tareaIdx) => { setProyectos(prev => prev.map((p, pIdx) => pIdx === proyectoIdx ? { ...p, tareas: p.tareas.map((t, tIdx) => tIdx === tareaIdx ? { ...t, estado: t.estado === 'Completada' ? 'Pendiente' : 'Completada' } : t) } : p )); };
  const getTaskStatusClass = (status) => { switch (status?.toLowerCase()) { case 'completada': return 'task-status-completed'; case 'en progreso': return 'task-status-in-progress'; case 'pendiente': return 'task-status-pending'; default: return 'task-status-default'; } };

  return (
    <>
      <Navbar />
      <header className="page-header"><h1>¡Gestiona tus Proyectos!</h1>{isCurrentUserPremium && (<p className="premium-message">¡Ahora eres premium, puedes agregar y gestionar tus proyectos sin límites!🤩</p>)}</header>
      <main className="proyectos-page-main"><div className="proyectos-page-container">
        {showAddProjectForm && (<section id="form-section" className="content-section"><form onSubmit={handleProjectSubmit} className="project-form"><h2>{editingProjectData ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}</h2><div className="form-grid"><div><label htmlFor="nombre-proyecto">Nombre del Proyecto</label><input type="text" id="nombre-proyecto" value={nombreProyecto} onChange={(e) => setNombreProyecto(e.target.value)} required /></div><div><label htmlFor="importancia">Importancia</label><select id="importancia" value={importancia} onChange={(e) => setImportancia(e.target.value)} required><option value="Alta">Alta</option><option value="Media">Media</option><option value="Baja">Baja</option></select></div><div><label htmlFor="fecha-inicio">Fecha de Inicio</label><input type="date" id="fecha-inicio" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required /></div><div><label htmlFor="fecha-limite">Fecha Límite</label><input type="date" id="fecha-limite" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} required /></div></div><button type="submit" className="submit-button">{editingProjectData ? 'Actualizar Proyecto' : 'Agregar Proyecto'}</button>{editingProjectData && (<button type="button" onClick={resetProjectForm} className="cancel-edit-btn" style={{ backgroundColor: '#6c757d', marginTop: '0.5rem' }}>Cancelar Edición</button>)}</form></section>)}
        <section id="lista-proyectos" className="content-section"><h2>Proyectos Actuales</h2><table className="projects-data-table"><thead><tr><th>Nombre</th><th>Inicio</th><th>Límite</th><th>Importancia</th><th>Tareas</th><th>Acciones Proyecto</th><th>Acciones Tarea</th></tr></thead>
          <tbody>{proyectos.length > 0 ? proyectos.map((proyecto, proyectoIndex) => (<tr key={proyecto.id || proyectoIndex}><td>{proyecto.nombre}</td><td>{proyecto.fechaInicio}</td><td>{proyecto.fechaLimite}</td><td>{proyecto.importancia}</td><td><ul>{(proyecto.tareas && proyecto.tareas.length > 0) ? proyecto.tareas.map((tarea, tareaIndex) => (<li key={tareaIndex}><strong>{tarea.nombreTarea}</strong> - <span className={`task-status-badge ${getTaskStatusClass(tarea.estado)}`}>{tarea.estado}</span><br /> Asignado a: {tarea.asignado}<br /> Límite: {tarea.fechaLimiteTarea}<div className="task-actions"><button onClick={() => openDeleteTaskModal(proyectoIndex, tareaIndex)} className="delete-task-btn">Eliminar</button><button onClick={() => handleCompleteTask(proyectoIndex, tareaIndex)} className={`complete-task-btn ${tarea.estado === 'Completada' ? 'task-status-completed-btn' : ''}`}>{tarea.estado === 'Completada' ? 'Marcar Pendiente' : 'Completar'}</button></div></li>)) : (<li>No hay tareas asignadas.</li>)}</ul></td><td><button onClick={() => handleEditProjectClickInterno(proyecto, proyectoIndex)} style={{ backgroundColor: '#ffc107', color: 'black', marginBottom: '5px', width: '100%' }}>Editar</button><button onClick={() => openDeleteProjectModal(proyectoIndex)} className="delete-project-btn" style={{ width: '100%' }}>Eliminar</button></td><td><button onClick={() => openAssignTaskModal(proyectoIndex)} className="assign-task-btn">Asignar Tarea</button></td></tr>)) : (<tr><td colSpan="7" style={{ textAlign: 'center', padding: '1rem' }}>No hay proyectos.</td></tr>)}</tbody>
        </table></section>
      </div></main>
      {showDeleteProjectModal && (<div className="modal-overlay"><div className="modal-content"><h3>¿Estás seguro de que deseas eliminar este proyecto?</h3><div className="modal-buttons"><button onClick={() => setShowDeleteProjectModal(false)} className="cancel-button">Cancelar</button><button onClick={confirmDeleteProject} className="confirm-button">Confirmar</button></div></div></div>)}
      {showAssignTaskModal && projectToAssignTaskIndex !== null && (<div className="modal-overlay"><div className="modal-content assign-task-modal-content"><h3>Asignar Nueva Tarea a "{proyectos[projectToAssignTaskIndex]?.nombre}"</h3><form onSubmit={handleAssignTaskSubmit}><div><label htmlFor="nombreTareaModal">Nombre de la tarea</label><input type="text" id="nombreTareaModal" value={nombreTarea} onChange={e => setNombreTarea(e.target.value)} required /></div><div><label htmlFor="asignadoAModal">Asignado a</label><input type="text" id="asignadoAModal" value={asignadoA} onChange={e => setAsignadoA(e.target.value)} required /></div><div><label htmlFor="fechaLimiteTareaModal">Fecha límite</label><input type="date" id="fechaLimiteTareaModal" value={fechaLimiteTarea} onChange={e => setFechaLimiteTarea(e.target.value)} required /></div><div><label htmlFor="estadoTareaModal">Estado</label><select id="estadoTareaModal" value={estadoTarea} onChange={e => setEstadoTarea(e.target.value)} required><option value="Pendiente">Pendiente</option><option value="En Progreso">En Progreso</option><option value="Completada">Completada</option></select></div><div className="modal-buttons"><button type="button" onClick={() => setShowAssignTaskModal(false)} className="cancel-button">Cancelar</button><button type="submit" className="submit-button" style={{ width: 'auto', backgroundColor: '#0ea5e9', marginTop: '0' }}>Asignar Tarea</button></div></form></div></div>)}
      {showDeleteTaskModal && taskToDeleteIndices.proyectoIdx !== null && taskToDeleteIndices.tareaIdx !== null && (<div className="modal-overlay"><div className="modal-content"><h3>¿Estás seguro de que deseas eliminar esta tarea?</h3><p>Proyecto: {proyectos[taskToDeleteIndices.proyectoIdx]?.nombre || 'Desconocido'}</p><p>Tarea: {proyectos[taskToDeleteIndices.proyectoIdx]?.tareas?.[taskToDeleteIndices.tareaIdx]?.nombreTarea || 'Desconocida'}</p><div className="modal-buttons"><button onClick={() => setShowDeleteTaskModal(false)} className="cancel-button">Cancelar</button><button onClick={confirmDeleteTask} className="confirm-button">Confirmar</button></div></div></div>)}
      {showLimitModal && (<div className="modal-overlay"><div className="modal-content limit-modal-content"><h3>¡Límite de Proyectos Alcanzado!</h3><p>Ya has alcanzado el límite máximo de {MAX_PROJECTS_NORMAL_USER} proyectos.<strong>Actualiza tu plan ahora para proyectos ilimitados.</strong></p><div className="limit-modal-buttons"><button onClick={() => setShowLimitModal(false)} className="close-limit-btn">Cerrar</button><button onClick={() => navigate('/planes')} className="upgrade-plan-btn">Ver Planes</button></div></div></div>)}
    </>
  );
}
export default ProyectosPage;