// src/pages/WelcomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css'; 

function WelcomePage() {
  return (
    <div className="welcome-page-wrapper">
      <div className="welcome-main-container">
        
        <div className="welcome-intro-section">
          <img 
            src="/img/PLANify premiumm.png" // Asegúrate que esta imagen esté en public/img/
            alt="PLANIFY PREMIUM" 
            className="welcome-main-logo" 
          />
          <div className="welcome-text-content">
            <h1>¡Bienvenido a la familia Planify Premium! <span role="img" aria-label="estrella">🌟</span></h1>
            <p>
              Gracias por confiar en nosotros para organizar tus sueños 
              y transformar tu tiempo en logros. <span role="img" aria-label="corazones">💛💚</span>
            </p>
          </div>
        </div>

        <div className="welcome-benefits-card-section">
          <div className="welcome-benefits-card">
            <img 
              src="/img/PLANify premiumm.png" // Y esta también
              alt="Planify Premium Logo en Tarjeta" 
              className="card-internal-logo" 
            />
            <h2>¡Acceso Exclusivo a Beneficios Premium!</h2>
            <ul>
              <li>✨ Soporte técnico prioritario <strong>24/7</strong>.</li>
              <li>✨ Sincronización <strong>instantánea</strong> en todos tus dispositivos.</li>
              <li>✨ Almacenamiento <strong>ampliado</strong> para tus proyectos y archivos.</li>
              <li>✨ Notificaciones <strong>inteligentes y personalizables</strong>.</li>
              <li>✨ Gestión de proyectos y tareas <strong>sin límites</strong>.</li>
            </ul>
            <Link to="/premium" className="cta-button">
              Explorar mi Espacio Premium
            </Link>
          </div>
        </div>

      </div>
      <img 
        src="/img/roco.png" // Asegúrate que esta imagen esté en public/img/
        alt="Roco, mascota de Planify" 
        className="welcome-roco-mascot-asomandose" // Corregido el nombre de la clase si tenía un carácter extraño
      />
    </div>
  );
}

export default WelcomePage;