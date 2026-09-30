import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import TicketsList from './TicketsList';
import TecnicosList from './TecnicosList';
import IntervencionesList from './IntervencionesList';
import logo from '../assets/logo.png';
import { supabase } from '../supabaseClient';

export default function Dashboard({ usuario, onLogout, baseUrl, headers }) {

  console.log('Datos del usuario en Dashboard:', usuario);
  const [activeTab, setActiveTab] = useState('TICKETS');
  const [metrics, setMetrics] = useState({
    abiertos: 0,
    enProgreso: 0,
    criticos: 0,
    tecnicos: '0/0'
  });

  // Cargar métricas dinámicas desde Supabase
  useEffect(() => {
    async function fetchMetrics() {
      try {
        const { data: tickets } = await supabase.from('Ticket').select('*');
        const { data: tecnicos } = await supabase.from('Tecnico').select('*');

        const disponibles = tecnicos ? tecnicos.filter(t => t.disponible === true || t.estado === 'disponible').length : 0;
        const totalTecnicos = tecnicos ? tecnicos.length : 0;

        if (tickets) {
          setMetrics({
            abiertos: tickets.filter(t => {
              const est = (t.estado || '').toLowerCase();
              return est === 'pendiente' || est === 'abierto';
            }).length,
            enProgreso: tickets.filter(t => {
              const est = (t.estado || '').toLowerCase();
              return est === 'en proceso' || est === 'en_progreso';
            }).length,
            criticos: tickets.filter(t => t.prioridad === 'alta' || t.prioridad === 'critica').length,
            tecnicos: totalTecnicos > 0 ? `${disponibles}/${totalTecnicos}` : '4/6'
          });
        }
      } catch (err) {
        console.error('Error al cargar métricas:', err);
      }
    }

    fetchMetrics();
  }, []);

  // Función para obtener el nombre dinámicamente sin importar el formato del objeto
  const obtenerNombreUsuario = () => {
    if (!usuario) return 'Usuario';
    if (typeof usuario === 'string') return usuario;
    
    return (
      usuario.nombre ||
      usuario.usuario ||
      usuario.user_metadata?.nombre ||
      usuario.user_metadata?.full_name ||
      usuario.email?.split('@')[0] ||
      'Usuario'
    );
  };

  const nombreMostrar = obtenerNombreUsuario();
  const inicial = nombreMostrar.charAt(0).toUpperCase();

  return (
    <div className="dashboard-container">
      {/* Header Superior */}
      <header className="dashboard-header">
        <div className="header-brand">
          <div className="brand-icon-wrapper">
            <img src={logo} alt="Logo CoreTech" className="brand-icon" />
          </div>
          <div>
            <h1 className="header-title">INCIDENCIAS — MESA DE AYUDA</h1>
            <p className="header-subtitle">SISTEMA DE GESTIÓN DE TICKETS v2.4</p>
          </div>
        </div>
        <div className="header-user-info">
          <span className="current-date">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
          </span>
          <div className="user-badge">
            <span className="avatar">{inicial}</span>
            <span className="username">{nombreMostrar}</span>
            <span className="role-dot">•</span>
            <span className="role">{usuario?.rol || 'Técnico'}</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            SALIR
          </button>
        </div>
      </header>

      {/* Tarjetas de Métricas */}
      <section className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">TICKETS ABIERTOS</span>
          <span className="metric-value color-open">{metrics.abiertos}</span>
          <span className="metric-subtext">Pendientes de asignación</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">EN PROGRESO</span>
          <span className="metric-value color-progress">{metrics.enProgreso}</span>
          <span className="metric-subtext">Con técnico asignado</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">PRIORIDAD CRÍTICA</span>
          <span className="metric-value color-critical">{metrics.criticos}</span>
          <span className="metric-subtext">Requieren atención inmediata</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">TÉCNICOS DISPONIBLES</span>
          <span className="metric-value color-available">{metrics.tecnicos}</span>
          <span className="metric-subtext">Capacidad operativa</span>
        </div>
      </section>

      {/* Navegación por Pestañas */}
      <nav className="dashboard-tabs">
        <button
          className={`tab-item ${activeTab === 'TICKETS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TICKETS')}
        >
          TICKETS
        </button>
        <button
          className={`tab-item ${activeTab === 'TECNICOS' ? 'active' : ''}`}
          onClick={() => setActiveTab('TECNICOS')}
        >
          TÉCNICOS
        </button>
        <button
          className={`tab-item ${activeTab === 'INTERVENCIONES' ? 'active' : ''}`}
          onClick={() => setActiveTab('INTERVENCIONES')}
        >
          INTERVENCIONES
        </button>
      </nav>

      {/* Vistas dinámicas */}
      {activeTab === 'TICKETS' && (
        <TicketsList 
          usuario={usuario} 
          baseUrl={baseUrl} 
          headers={headers} 
        />
      )}
      {activeTab === 'TECNICOS' && (
        <TecnicosList baseUrl={baseUrl} headers={headers} />
      )}
      {activeTab === 'INTERVENCIONES' && (
        <IntervencionesList baseUrl={baseUrl} headers={headers} />
      )}
    </div>
  );
}