import React, { useState } from 'react';
import './Register.css';
// 1. Importa tu cliente de supabase (ajusta la ruta según la ubicación de tu archivo)
import { supabase } from '../supabaseClient'; 

export default function Register({ onIrALogin, onRegistroExitoso }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [telefono, setTelefono] = useState('');
  const [edad, setEdad] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Separar el nombre completo en nombre y apellido
    const partes = nombreCompleto.trim().split(' ');
    const nombre = partes[0] || '';
    const apellido = partes.slice(1).join(' ') || '';

    // 3. Insertar el registro directamente en la tabla Cliente de Supabase
    const { data, error } = await supabase
      .from('Cliente')
      .insert([
        {
          nombre: nombre,
          apellido: apellido,
          email: usuario.trim(),
          telefono: telefono.trim(),
          edad: edad.trim()
        }
      ]);

    if (error) {
      console.error('Error al insertar en Supabase:', error);
      alert('Hubo un error al registrar en la base de datos: ' + error.message);
      return;
    }

    alert('¡Registro exitoso! Ahora puedes iniciar sesión con tu cuenta.');

    if (onRegistroExitoso) {
      onRegistroExitoso({ nombre, usuario, password, telefono, edad });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <span></span><span></span><span></span><span></span>
        </div>
        <h1 className="login-title">CORETECH</h1>
        <p className="login-subtitle">GESTIÓN DE PROBLEMAS TECNICOS v.0.1</p>
        <p className="login-subtitle">CREAR CUENTA</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>NOMBRE COMPLETO</label>
            <input
              type="text"
              placeholder="Ej. Ana Valenzuela"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>USUARIO O CORREO</label>
            <input
              type="text"
              placeholder="correo@ejemplo.com"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>TELÉFONO</label>
            <input
              type="tel"
              placeholder="Ej. 1122334455"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>EDAD</label>
            <input
              type="number"
              placeholder="Ej. 28"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>CONTRASEÑA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login">
            REGISTRARSE
          </button>
        </form>

        <div className="login-register-link">
          ¿Ya tienes cuenta?{' '}
          <button type="button" className="btn-text-link" onClick={onIrALogin}>
            INICIAR SESIÓN
          </button>
        </div>
      </div>

      <footer className="login-footer">
         © 2026 SISTEMA DE LOS CHICOS DE 6to TC
      </footer>
    </div>
  );
}