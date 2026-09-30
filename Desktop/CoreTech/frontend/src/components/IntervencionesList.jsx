import React, { useState, useEffect } from 'react';
import './TicketsList.css';
import { supabase } from '../supabaseClient';

export default function IntervencionesList() {
  const [intervenciones, setIntervenciones] = useState([]);
  const [selectedIntervencion, setSelectedIntervencion] = useState(null);
  const [progresoTexto, setProgresoTexto] = useState('');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('En Proceso');
  const [cargando, setCargando] = useState(false);

  // Cargar lista de procesos / intervenciones
  const fetchIntervenciones = async () => {
    const { data, error } = await supabase
      .from('proceso')
      .select('*')
      .order('id_proceso', { ascending: false });

    if (!error && data) {
      setIntervenciones(data);
    }
  };

  useEffect(() => {
    fetchIntervenciones();
  }, []);

  // Actualizar el progreso y el estado
  const handleGuardarProgreso = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // 1. Actualizar en la tabla proceso
      const { error: errorProceso } = await supabase
        .from('proceso')
        .update({
          progreso_del_dia: progresoTexto,
          estado_ticket: estadoSeleccionado,
          fecha_hora: new Date().toISOString()
        })
        .eq('id_proceso', selectedIntervencion.id_proceso);

      if (errorProceso) throw errorProceso;

      // 2. Si tiene id_ticket vinculado, actualizar también el estado en la tabla Ticket
      if (selectedIntervencion.id_ticket) {
        const { error: errorTicket } = await supabase
          .from('Ticket')
          .update({ estado: estadoSeleccionado })
          .eq('id_ticket', selectedIntervencion.id_ticket);

        if (errorTicket) console.error('Error al actualizar estado en Ticket:', errorTicket);
      }

      alert(`¡Intervención #${selectedIntervencion.id_proceso} actualizada exitosamente!`);
      setSelectedIntervencion(null);
      setProgresoTexto('');
      fetchIntervenciones();
    } catch (err) {
      console.error('Error:', err);
      alert('Error al guardar el progreso: ' + err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="tickets-container">
      <div className="filters-bar">
        <span className="filter-label">HISTORIAL DE PROCESOS / INTERVENCIONES</span>
        <span className="results-count">{intervenciones.length} registros</span>
      </div>

      <div className="table-responsive">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID PROC.</th>
              <th>ID TICKET</th>
              <th>ID TÉCNICO</th>
              <th>FECHA Y HORA</th>
              <th>ESTADO</th>
              <th>PROGRESO DEL DÍA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {intervenciones.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                  No hay registros en la tabla proceso.
                </td>
              </tr>
            ) : (
              intervenciones.map((item) => (
                <tr key={item.id_proceso}>
                  <td>#{item.id_proceso}</td>
                  <td>#{item.id_ticket || 'N/A'}</td>
                  <td>#{item.id_tecnico || 'N/A'}</td>
                  <td>
                    {item.fecha_hora 
                      ? new Date(item.fecha_hora).toLocaleString('es-ES') 
                      : 'Sin fecha'}
                  </td>
                  <td>
                    <span className={`badge-status status-${(item.estado_ticket || 'en_proceso').toLowerCase().replace(' ', '_')}`}>
                      {(item.estado_ticket || 'EN PROCESO').toUpperCase()}
                    </span>
                  </td>
                  <td>{item.progreso_del_dia || 'Sin detalle'}</td>
                  <td>
                    <button 
                      className="btn-trabajar"
                      onClick={() => {
                        setSelectedIntervencion(item);
                        setProgresoTexto(item.progreso_del_dia || '');
                        setEstadoSeleccionado(item.estado_ticket || 'En Proceso');
                      }}
                    >
                      REGISTRAR PROGRESO
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para editar/registrar el progreso del día y estado */}
      {selectedIntervencion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>REGISTRAR PROGRESO DEL DÍA (PROC. #{selectedIntervencion.id_proceso})</h2>

            <form onSubmit={handleGuardarProgreso} style={{ marginTop: '15px' }}>
              <p style={{ marginBottom: '10px', textAlign: 'left' }}>
                <strong>Ticket Asociado:</strong> #{selectedIntervencion.id_ticket || 'N/A'}
              </p>

              {/* Selector de Estado */}
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label><strong>ESTADO DEL TICKET:</strong></label>
                <select 
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  value={estadoSeleccionado}
                  onChange={(e) => setEstadoSeleccionado(e.target.value)}
                  required
                >
                  <option value="En Espera">En Espera</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>

              {/* Campo para el detalle del progreso */}
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <label><strong>DETALLE DEL PROGRESO:</strong></label>
                <textarea
                  style={{ width: '100%', padding: '8px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                  rows="4"
                  placeholder="Escribe los avances o actualizaciones del trabajo..."
                  value={progresoTexto}
                  onChange={(e) => setProgresoTexto(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="submit" disabled={cargando} className="btn-guardar">
                  {cargando ? 'GUARDANDO...' : 'GUARDAR PROGRESO'}
                </button>
                <button 
                  type="button" 
                  className="btn-cancelar" 
                  onClick={() => setSelectedIntervencion(null)}
                >
                  CERRAR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}