// src/pages/PlanesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './PlanesPage.css';
import Swal from 'sweetalert2'; 

const CheckIcon = () => (
  <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
  </svg>
);

function PlanesPage() {
  const navigate = useNavigate();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isUserCurrentlyPremium, setIsUserCurrentlyPremium] = useState(localStorage.getItem('userPlan') === 'premium');

  useEffect(() => {
    const handlePlanChangeForPage = () => {
      setIsUserCurrentlyPremium(localStorage.getItem('userPlan') === 'premium');
    };
    handlePlanChangeForPage(); 
    window.addEventListener('userPlanChanged', handlePlanChangeForPage);
    window.addEventListener('storage', handlePlanChangeForPage);
    return () => {
      window.removeEventListener('userPlanChanged', handlePlanChangeForPage);
      window.removeEventListener('storage', handlePlanChangeForPage);
    };
  }, []);

  const handleAdquirirClick = (plan) => {
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (event) => {
    event.preventDefault();
    const currentUserEmail = localStorage.getItem('currentUserEmail');

    if (!currentUserEmail) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.',
        });
        setShowPaymentModal(false);
        return;
    }

    const userDataString = localStorage.getItem(currentUserEmail);
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        userData.plan = 'premium'; 
        localStorage.setItem(currentUserEmail, JSON.stringify(userData));
        localStorage.setItem('userPlan', 'premium'); 
        window.dispatchEvent(new CustomEvent('userPlanChanged')); 
        setIsUserCurrentlyPremium(true); 

        setShowPaymentModal(false); 
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu pago ha sido procesado correctamente. ¡Bienvenido a Premium!',
          confirmButtonText: 'Ir a Bienvenida'
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/welcome'); 
          }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron guardar los datos del plan. Intenta de nuevo.',
        });
        setShowPaymentModal(false);
    }
  };

  return (
    <div className="planes-page-wrapper">
      <Navbar /> 
      <div className="planes-content-container">
        <div className="page-intro-text">
          <h2 className="subtitle">¡Nuestros planes!</h2>
          <p className="title">¡Planificación y organización sin limites!</p>
          <p className="description">
            Organiza tu tiempo y planifica tus tareas sin ningún tipo de límites. ¡El control total de tus proyectos está a un clic de distancia!
          </p>
        </div>

        <div className="plans-grid">
          <div className="plan-card standard">
            <h3 className="plan-name">Estándar</h3>
            <p className="price-container">
              <span className="price">10.000$ COP</span>
              <span className="price-period">/Mes</span>
            </p>
            <p className="plan-description">
              Mantente al tanto de tus proyectos, sin sorpresas. Con el Plan Estándar, recibirás notificaciones para nunca perder el ritmo.
            </p>
            <ul className="features-list">
              <li><CheckIcon /> Notificaciones sobre tareas.</li>
              <li><CheckIcon /> Estadisticas detalladas.</li>
              <li><CheckIcon /> Podrás agregar y gestionar hasta 5 proyectos.</li>
            </ul>
            <button onClick={() => handleAdquirirClick('estandar')} className="action-button">
              ¡Adquiérelo ahora!
            </button>
          </div>

          <div className="plan-card premium">
            <h3 className="plan-name">Premium</h3>
            <p className="price-container">
              <span className="price">15.000$ COP</span>
              <span className="price-period">/Mes</span>
            </p>
            <p className="plan-description">
              <strong>Lleva tu productividad al siguiente nivel. Con el Plan Premium, obtén notificaciones exclusivas y acceso prioritario para un control total de tus proyectos.</strong>
            </p>
            <ul className="features-list">
              <li><CheckIcon /> Soporte técnico prioritario.</li>
              <li><CheckIcon /> Sincronización en tiempo real.</li>
              <li><CheckIcon /> Mayor almacenamiento.</li>
              <li><CheckIcon /> Notificación sobre tareas y proyectos con próximos a llegar a su fecha límite.</li>
              <li><CheckIcon /> Puedes agregar y gestionar proyectos ilimitados.</li>
            </ul>
            <button onClick={() => handleAdquirirClick('premium')} className="action-button">
              ¡Adquiérelo ahora!
            </button>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal-content">
            <h2>Completa tu pago</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div>
                <label htmlFor="cardNumber">Número de tarjeta</label>
                <input type="text" id="cardNumber" maxLength="16" placeholder="1234 5678 9012 3456" required />
              </div>
              <div>
                <label htmlFor="expiryDate">Fecha de expiración</label>
                <input type="month" id="expiryDate" required />
              </div>
              <div>
                <label htmlFor="cvv">Código CVV</label>
                <input type="password" id="cvv" maxLength="3" placeholder="123" required />
              </div>
              <div className="payment-modal-buttons">
                <button type="button" onClick={() => setShowPaymentModal(false)} className="cancel-payment-btn">
                  Cancelar
                </button>
                <button type="submit" className="confirm-payment-btn">
                  Pagar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <footer className="planes-page-footer">
        <p>©PLANIFY - 2024 (EEMSJ)</p>
      </footer>
    </div>
  );
}

export default PlanesPage;