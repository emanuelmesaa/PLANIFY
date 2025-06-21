import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Swal from 'sweetalert2';

function LoginPage() {
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true); 

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [registerNombre, setRegisterNombre] = useState('');
  const [registerApellido, setRegisterApellido] = useState('');
  const [registerCorreo, setRegisterCorreo] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const switchToLogin = () => {
    setRegisterNombre('');
    setRegisterApellido('');
    setRegisterCorreo('');
    setRegisterPassword('');
    setShowRegisterPassword(false);
    setIsLoginView(true); 
  };

  const switchToRegister = () => {
    setLoginUsername('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setIsLoginView(false); 
  };

  const toggleShowLoginPassword = () => {
    setShowLoginPassword(prevState => !prevState);
  };

  const toggleShowRegisterPassword = () => {
    setShowRegisterPassword(prevState => !prevState);
  };

  const handleRegisterUser = (e) => {
    e.preventDefault(); 
    if (registerNombre && registerApellido && registerCorreo && registerPassword) {
      if (localStorage.getItem(registerCorreo)) {
        Swal.fire({
          icon: "error", title: "Error de Registro",
          text: "Este correo electrónico ya está registrado. Por favor, inicia sesión o usa otro correo.",
          confirmButtonText: "Entendido"
        });
        return;
      }
      const user = { 
        nombre: registerNombre, apellido: registerApellido, correo: registerCorreo, 
        password: registerPassword, plan: 'normal' 
      };
      localStorage.setItem(registerCorreo, JSON.stringify(user));
      Swal.fire({
        position: "center", icon: "success", title: "Registro exitoso",
        text: "Ahora puedes iniciar sesión.", showConfirmButton: false, timer: 1500
      });
      switchToLogin(); 
    } else {
      Swal.fire({
        icon: "warning", title: "Faltan campos",
        text: "Por favor, completa todos los campos.", confirmButtonText: "Entendido"
      });
    }
  };

  const handleValidateLogin = (e) => {
    e.preventDefault(); 
    const userDataString = localStorage.getItem(loginUsername); 

    if (userDataString) {
      const userData = JSON.parse(userDataString);
      if (userData.password === loginPassword) {
        Swal.fire({
          position: "center", icon: "success", title: "Inicio de sesión exitoso",
          showConfirmButton: false, timer: 1500
        });
        setShowLoginPassword(false);
        localStorage.setItem('currentUserEmail', userData.correo);
        const userPlan = userData.plan || 'normal';
        localStorage.setItem('userPlan', userPlan); 
        window.dispatchEvent(new CustomEvent('userPlanChanged'));
        setTimeout(() => {
          if (userPlan === 'premium') {
            navigate('/premium'); 
          } else {
            navigate('/'); 
          }
        }, 1500);
      } else {
        Swal.fire({
          icon: "error", position: "center", title: "Error",
          text: "Correo o contraseña incorrectos.", confirmButtonText: "Intentar de nuevo",
          customClass: { confirmButton: 'custom-confirm-button' }, buttonsStyling: false
        });
      }
    } else {
      Swal.fire({
        icon: "error", position: "center", title: "Error",
        text: "Usuario no encontrado. Por favor, regístrate.", confirmButtonText: "Entendido"
      });
    }
  };

  return (
    <div className="login-page-body-bg">
      <div className="login-wrapper">
        <nav className="login-nav">
          <div className="login-nav-logo">
            {}
            <img src="/img/PLANify with rocco white.png" alt="PLANIFY Logo" />
          </div>
          <div className="login-nav-button">
            <button 
              className={`btn ${isLoginView ? 'active-form-btn' : ''}`} 
              onClick={switchToLogin}
            >
              Iniciar sesión
            </button>
            <button 
              className={`btn ${!isLoginView ? 'active-form-btn' : ''}`} 
              id="registerBtnFromNav" 
              onClick={switchToRegister}
            >
              Regístrate
            </button>
          </div>
        </nav>

        <div className="login-form-box">
          {isLoginView ? (
            <form 
              className="login-container"
              id="loginForm"
              onSubmit={handleValidateLogin}
            >
              <div className="form-top-text">
                <span>¿No tienes una cuenta? <a onClick={switchToRegister} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && switchToRegister()}>Regístrate</a></span>
              </div>
              <header className="form-header">Inicio de Sesión</header>
              <div className="input-box">
                <input 
                  type="email"
                  className="input-field" 
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Correo" 
                  required
                />
              </div>
              <div className="input-box password-input-container">
                <input 
                  type={showLoginPassword ? "text" : "password"} 
                  className="input-field" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Contraseña" 
                  required
                />
                <span onClick={toggleShowLoginPassword} className="password-toggle-icon" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleShowLoginPassword()}>
                  {showLoginPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <div className="input-box">
                <button type="submit" className="submit-button">Iniciar Sesión</button>
              </div>                     
              <div className="form-two-col">
                <div className="one">
                  <input type="checkbox" id="login-check" />
                  <label htmlFor="login-check">Recuérdame</label>
                </div>
              </div>
            </form>
          ) : (
            <form 
              className="register-container"
              id="registerForm" 
              onSubmit={handleRegisterUser}
            >
              <div className="form-top-text">
                <span>¿Tienes una cuenta? <a onClick={switchToLogin} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && switchToLogin()}>Iniciar Sesión</a></span>
              </div>
              <header className="form-header">Regístrate</header>
              <div className="two-forms-grid">
                <div className="input-box">
                  <input type="text" className="input-field" value={registerNombre} onChange={(e) => setRegisterNombre(e.target.value)} placeholder="Nombre" required />
                </div>
                <div className="input-box">
                  <input type="text" className="input-field" value={registerApellido} onChange={(e) => setRegisterApellido(e.target.value)} placeholder="Apellido" required />
                </div>
              </div>
              <div className="input-box">
                <input type="email" className="input-field" value={registerCorreo} onChange={(e) => setRegisterCorreo(e.target.value)} placeholder="Correo" required />
              </div>
              <div className="input-box password-input-container">
                <input type={showRegisterPassword ? "text" : "password"} className="input-field" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="Contraseña" required />
                <span onClick={toggleShowRegisterPassword} className="password-toggle-icon" role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && toggleShowRegisterPassword()}>
                  {showRegisterPassword ? '🙈' : '👁️'}
                </span>
              </div>
              <div className="input-box">
                <button type="submit" className="submit-button">Registrarse</button>
              </div>
              <div className="form-two-col">
                <div className="one">
                  <input type="checkbox" id="register-check" />
                  <label htmlFor="register-check">Recuérdame</label>
                </div>
                <div className="two">
                  <label><a href="#">Términos & Condiciones</a></label>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;