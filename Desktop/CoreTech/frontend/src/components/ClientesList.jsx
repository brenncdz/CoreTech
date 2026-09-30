import React, { useEffect, useState } from 'react';
import './ClientesList.css';

export default function ClientesList({ baseUrl, headers }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${baseUrl}/Cliente?select=*`, { method: 'GET', headers })
      .then(res => res.json())
      .then(data => {
        setClientes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [baseUrl, headers]);

  if (loading) return <p>Cargando clientes...</p>;
  if (error) return <p>Error al cargar clientes: {error}</p>;

  return (
    <div>
      <h4>Lista de Clientes ({clientes.length}):</h4>
      {clientes.length > 0 ? (
        <ul>
          {clientes.map(cliente => (
            <li key={cliente.id_cliente}>
              {cliente.nombre} {cliente.apellido} - {cliente.email}
              {cliente.telefono ? ` - Tel: ${cliente.telefono}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay clientes registrados.</p>
      )}
    </div>
  );
}