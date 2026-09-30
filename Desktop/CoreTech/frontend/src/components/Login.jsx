import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/logo.png';
import { supabase } from '../supabaseClient'; // Importa el cliente de Supabase

export default function Login({
  onLogin,
  onIrARegistro
}) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userClean = usuario.trim();
    const passClean = password.trim();

    // 1. CREDENCIALES DE PRUEBA RÁPIDAS (Si aún deseas conservarlas en local)
    if (userClean === 'admin' && passClean === 'admin123') {
      setError('');
      onLogin({ usuario: 'admin', nombre: 'Administrador', rol: 'admin' });
      return;
    }

    try {
      // 2. CONSULTAR TABLA CLIENTE EN SUPABASE
      const { data: clienteData } = await supabase
        .from('Cliente')
        .select('*')
        .eq('email', userClean)
        .maybeSingle();

      if (clienteData) {
        setError('');
        onLogin({
          ...clienteData,
          usuario: clienteData.email,
          rol: clienteData.rol || 'usuario'
        });
        return;
      }

      // 3. CONSULTAR TABLA TÉCNICO EN SUPABASE
      const { data: tecnicoData } = await supabase
        .from('Tecnico')
        .select('*')
        .eq('email', userClean) // O la columna correspondiente en tu tabla Tecnico (ej: usuario)
        .maybeSingle();

      if (tecnicoData) {
        setError('');
        onLogin({
          ...tecnicoData,
          usuario: tecnicoData.email || tecnicoData.nombre,
          rol: 'tecnico'
        });
        return;
      }

      // 4. SI NO COINCIDE CON NINGUNA TABLA
      setError('Usuario o contraseña incorrectos.');

    } catch (err) {
      console.error("Error al autenticar:", err);
      setError('Ocurrió un error al verificar las credenciales.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo CoreTech" className="login-icon" />
        <h1 className="login-title">CORETECH</h1>
        <p className="login-subtitle">GESTIÓN DE PROBLEMAS TECNICOS v.0.1</p>

        {error && <div className="login-error-badge">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>USUARIO O CORREO</label>
            <input
              type="text"
              placeholder="Ingrese su usuario o correo"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
<div className="password-wrapper">
  <div className="form-group">
  <label>CONTRASEÑA</label>

  <div className="password-wrapper">
    <input
      type={mostrarPassword ? 'text' : 'password'}
      placeholder="••••••••"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />

    <button
      type="button"
      className="password-toggle"
      onClick={() => setMostrarPassword(!mostrarPassword)}
      aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
    >
      {mostrarPassword ? '◉' : '◉'}
    </button>
  </div>
</div>

  
</div>

          <button type="submit" className="btn-login">
            INICIAR SESIÓN
          </button>
        </form>

        <div className="login-credentials">CORETECH te da la bienvenida otra vez</div>

        <div className="login-register-link">
          ¿No tienes cuenta?{' '}
          <button type="button" className="btn-text-link" onClick={onIrARegistro}>
            REGISTRARSE →
          </button>
        </div>
      </div>

      <footer className="login-footer">
        © 2026 SISTEMA DE LOS CHICOS DE 6to TC
      </footer>
    </div>
  );
}