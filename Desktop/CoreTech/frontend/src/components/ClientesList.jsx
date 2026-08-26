import React, { useEffect, useState } from 'react';

export default function ClientesList({ baseUrl, headers }) {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/Cliente?select=*`, { method: 'GET', headers })
      .then(res => res.json())
      .then(data => {
        setClientes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando clientes...</p>;

  return (
    <div>
      <h4>Lista de Clientes ({clientes.length}):</h4>
      {clientes.length > 0 ? (
        <ul>
          {clientes.map(cliente => (
            <li key={cliente.id_cliente}>
              {cliente.nombre} {cliente.apellido} - {cliente.email}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay clientes registrados.</p>
      )}
    </div>
  );
}