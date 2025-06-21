// src/pages/AnaliticaPage.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import './AnaliticaPage.css'; 

function AnaliticaPage() {
  const [isUserPremium, setIsUserPremium] = useState(localStorage.getItem('userPlan') === 'premium');

  useEffect(() => {
    const handlePlanChange = () => {
      setIsUserPremium(localStorage.getItem('userPlan') === 'premium');
    };
    handlePlanChange(); 
    window.addEventListener('userPlanChanged', handlePlanChange);
    window.addEventListener('storage', handlePlanChange);
    return () => {
      window.removeEventListener('userPlanChanged', handlePlanChange);
      window.removeEventListener('storage', handlePlanChange);
    };
  }, []);

  // Nombres exactos de tus archivos de imagen en public/img/
  const imgResponsables = "/img/5 responsables con mas tareas.png";
  const imgDistFechas = "/img/Distribución de fechas de entrega.png";
  const imgDistPorcentual = "/img/Distribución porcentual de tareas.png";
  const imgTareasEstado = "/img/Tareas por estado.png";
  const imgTareasProximas = "/img/Tareas próximas a vencer.png";

  return (
    <div className="analitica-page-wrapper">
      <Navbar /> 
      
      <div className="analitica-content-container">
        <header className="analitica-page-header">
          <h1>Centro de Analíticas de Planify</h1>
        </header>
        
        <main className="analitica-main-section">
          <p>
            Visualiza el rendimiento y progreso de tus proyectos y tareas con nuestras analíticas detalladas.
          </p>

          <div className="analytics-charts-grid">
            <div className="analytics-chart-item">
              <h2>Top 5 Responsables</h2>
              <img 
                src={imgResponsables} 
                alt="Gráfico de 5 responsables con más actividad" 
                className="analytics-image"
              />
              <p className="chart-description">Identifica los miembros del equipo con mayor asignación o completitud de tareas.</p>
            </div>
            
            <div className="analytics-chart-item">
              <h2>Distribución de Fechas de Entrega</h2>
              <img 
                src={imgDistFechas} 
                alt="Gráfico de distribución de fechas de entrega" 
                className="analytics-image"
              />
              <p className="chart-description">Visualización de cómo se distribuyen las fechas límite a lo largo del tiempo.</p>
            </div>

            <div className="analytics-chart-item">
              <h2>Distribución Porcentual de Estados</h2>
              <img 
                src={imgDistPorcentual} 
                alt="Gráfico de distribución porcentual de estados de tareas" 
                className="analytics-image"
              />
              <p className="chart-description">Porcentaje de tareas en estado pendiente, en progreso y completadas.</p>
            </div>

            <div className="analytics-chart-item">
              <h2>Tareas por Estado</h2>
              <img 
                src={imgTareasEstado} 
                alt="Gráfico de cantidad de tareas por estado" 
                className="analytics-image"
              />
              <p className="chart-description">Número total de tareas clasificadas por su estado actual.</p>
            </div>

            <div className="analytics-chart-item">
              <h2>Tareas Próximas a Vencer</h2>
              <img 
                src={imgTareasProximas} 
                alt="Gráfico de tareas próximas a su fecha de vencimiento" 
                className="analytics-image"
              />
              <p className="chart-description">Listado o conteo de tareas importantes con fechas límite cercanas.</p>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}

export default AnaliticaPage;