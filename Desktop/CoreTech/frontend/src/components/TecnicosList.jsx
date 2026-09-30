import React, { useEffect, useState } from 'react';
import './TicketsList.css';
import { supabase } from '../supabaseClient';

export default function TecnicosList() {
  const [tecnicos, setTecnicos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTecnicos() {
      try {
        setCargando(true);
        const { data, error } = await supabase
          .from('Tecnico')
          .select('*');

        if (error) {
          throw error;
        }

        setTecnicos(data || []);
      } catch (err) {
        console.error('Error al obtener técnicos:', err);
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchTecnicos();
  }, []);

  if (cargando) {
    return <div className="tickets-container">Cargando técnicos...</div>;
  }

  if (error) {
    return <div className="tickets-container">Error al cargar técnicos: {error}</div>;
  }

  return (
    <div className="tickets-container">
      <div className="filters-bar">
        <span className="filter-label">TÉCNICOS ACTIVOS</span>
        <span className="results-count">{tecnicos.length} técnicos</span>
      </div>

      <div className="table-responsive">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>ESPECIALIDAD</th>
              <th>TELÉFONO</th>
            </tr>
          </thead>
          <tbody>
            {tecnicos.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No hay técnicos registrados.
                </td>
              </tr>
            ) : (
              tecnicos.map((tec) => (
                <tr key={tec.id_tecnico}>
                  <td className="col-id">TEC-{tec.id_tecnico}</td>
                  <td className="ticket-title">{tec.nombre}</td>
                  <td className="col-category">{tec.especialidad || 'Sin especificación'}</td>
                  <td>{tec.telefono || 'Sin teléfono'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}