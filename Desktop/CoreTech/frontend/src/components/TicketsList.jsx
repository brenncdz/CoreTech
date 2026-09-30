import React, { useState, useEffect } from 'react';
import './TicketsList.css';
import { supabase } from '../supabaseClient';

export default function TicketsList() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Cargar lista de tickets
  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from('Ticket')
      .select('*')
      .order('id_ticket', { ascending: true });

    if (error) {
      console.error('Error al obtener tickets:', error);
    } else if (data) {
      setTickets(data);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Función para tomar el ticket y cambiar su estado
  const handleAceptarTicket = async (ticket) => {
    setCargando(true);
    try {
      // 1. Cambiar estado a 'En Proceso' en Supabase
      const { data: ticketActualizado, error: errorTicket } = await supabase
        .from('Ticket')
        .update({ estado: 'En Proceso' })
        .eq('id_ticket', ticket.id_ticket)
        .select();

      if (errorTicket) throw errorTicket;

      console.log('Ticket actualizado con éxito:', ticketActualizado);

      // 2. Registrar avance en la tabla 'proceso'
      const { error: errorProceso } = await supabase
        .from('proceso')
        .insert([
          {
            id_ticket: ticket.id_ticket,
            id_tecnico: ticket.id_tecnico || null,
            fecha_hora: new Date().toISOString(),
            estado_ticket: 'En Proceso',
            progreso_del_dia: `Técnico asignado al Ticket #${ticket.id_ticket}. Inicio de revisiones.`
          }
        ]);

      if (errorProceso) {
        console.warn('Advertencia al insertar proceso:', errorProceso);
      }

      alert(`¡Ticket #${ticket.id_ticket} actualizado a "En Proceso"!`);
      
      // 3. Cerrar el modal y refrescar la lista
      setSelectedTicket(null);
      await fetchTickets();

    } catch (err) {
      console.error('Error detallado:', err);
      alert('Error al actualizar el ticket: ' + (err.message || 'Consulta rechazada por Supabase.'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="tickets-container">
      <div className="filters-bar">
        <span className="filter-label">LISTADO DE TICKETS</span>
        <span className="results-count">{tickets.length} registros</span>
      </div>

      <div className="table-responsive">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>PROBLEMA</th>
              <th>FECHA CREACIÓN</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  No se encontraron tickets registrados.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id_ticket}>
                  <td>#{t.id_ticket}</td>
                  <td>{t.problema || 'Sin detalle'}</td>
                  <td>{t.fechaCreacion || 'Sin fecha'}</td>
                  <td>
                    {/* Render de etiqueta de estado */}
                    <span className={`badge-status status-${(t.estado || 'en_espera').toLowerCase().replace(/\s+/g, '_')}`}>
                      {(t.estado || 'En Espera').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-trabajar"
                      onClick={() => setSelectedTicket(t)}
                    >
                      VER DETALLE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalle */}
      {selectedTicket && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>DETALLE DEL TICKET #{selectedTicket.id_ticket}</h2>
            
            <div style={{ marginTop: '15px', marginBottom: '15px', textAlign: 'left' }}>
              <p style={{ marginBottom: '10px' }}>
                <strong>Problema / Asunto:</strong><br />
                {selectedTicket.problema || 'Sin detalle especificado.'}
              </p>

              <p style={{ marginBottom: '10px' }}>
                <strong>Fecha de Creación:</strong> {selectedTicket.fechaCreacion || 'Sin fecha'}
              </p>

              <p style={{ marginBottom: '10px' }}>
                <strong>ID Cliente:</strong> #{selectedTicket.id_cliente || 'N/A'}
              </p>

              <p style={{ marginBottom: '10px' }}>
                <strong>Estado Actual:</strong>{' '}
                <span className={`badge-status status-${(selectedTicket.estado || 'en_espera').toLowerCase().replace(/\s+/g, '_')}`}>
                  {(selectedTicket.estado || 'En Espera').toUpperCase()}
                </span>
              </p>
            </div>

            <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                type="button" 
                disabled={cargando} 
                className="btn-guardar"
                onClick={() => handleAceptarTicket(selectedTicket)}
              >
                {cargando ? 'PROCESANDO...' : 'TRABAJAR EN ELLO'}
              </button>

              <button 
                type="button" 
                className="btn-cancelar"
                onClick={() => setSelectedTicket(null)}
              >
                CERRAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}