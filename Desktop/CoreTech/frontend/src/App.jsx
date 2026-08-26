import React, { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState('Conectando...');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const projectRef = "zazwmmveergrnriuhann";
    const apiKey = "sb_publishable_T89K9Qp4Cavh9rCma6LjjQ_9FphvF8e";
    const url = `https://${projectRef}.supabase.co/rest/v1/Cliente?select=*`;

    fetch(url, {
      method: 'GET',
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Datos recibidos:", data);
      setStatus(`Conexión exitosa. Se cargaron ${data.length} registros.`);
      setClientes(data);
    })
    .catch(error => {
      setStatus(`Error al conectar: ${error.message}`);
    });
  }, []); 

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h3>Estado de la conexión a Supabase:</h3>
      <p>{status}</p>

      {clientes.length > 0 && (
        <div>
          <h4>Lista de Clientes:</h4>
          <ul>
            {clientes.map(cliente => (
              <li key={cliente.id_cliente}>
                {cliente.nombre} {cliente.apellido} - {cliente.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}