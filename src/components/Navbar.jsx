// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Navbar.css'; 

const logoNormalAsset = "/img/PLANify with rocco.png"; 
const logoPremiumAsset = "/img/PLANify with rocco black.png"; 

const Navbar = () => {
  const [isPremiumUser, setIsPremiumUser] = useState(localStorage.getItem('userPlan') === 'premium');

  useEffect(() => {
    const handlePlanChange = () => {
      setIsPremiumUser(localStorage.getItem('userPlan') === 'premium');
    };
    
    handlePlanChange(); 

    window.addEventListener('userPlanChanged', handlePlanChange);
    window.addEventListener('storage', handlePlanChange);

    return () => {
      window.removeEventListener('userPlanChanged', handlePlanChange);
      window.removeEventListener('storage', handlePlanChange);
    };
  }, []);

  const displayLogo = isPremiumUser ? logoPremiumAsset : logoNormalAsset;
  const homeLink = isPremiumUser ? "/premium" : "/"; 
  const proyectosLink = isPremiumUser ? "/proyectos-premium" : "/proyectos";

  return (
    <nav className="navbar-main navbar-gradient-bg shadow"> 
      <div className="navbar-container"> 
        <div className="navbar-content-centered">
          <div className="navbar-logo-single-container">
            <Link to={homeLink}>
              <img 
                className={isPremiumUser ? "navbar-logo-premium" : "navbar-logo-normal"} 
                src={displayLogo} 
                alt="PLANIFY" 
              />
            </Link>
          </div>
          <div className="navbar-links-container">
            <NavLink
              to={homeLink}
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            >
              Inicio
            </NavLink>
            <NavLink
              to={proyectosLink}
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            >
              Proyectos
            </NavLink>
            <NavLink 
              to="/calendario" 
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            >
              Calendario
            </NavLink>
            {}
            {!isPremiumUser && (
              <NavLink 
                to="/planes" 
                className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
              >
                Planes
              </NavLink>
            )}
            <NavLink 
              to="/analitica" 
              className={({ isActive }) => `navbar-link ${isActive ? "active" : ""}`}
            >
              Analítica
            </NavLink>
            <Link 
              to="/login" 
              className="navbar-link navbar-link-logout"
              onClick={() => {
                localStorage.removeItem('userPlan');
                localStorage.removeItem('currentUserEmail'); 
                window.dispatchEvent(new CustomEvent('userPlanChanged')); 
              }}
            >
              Cerrar Sesión
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;