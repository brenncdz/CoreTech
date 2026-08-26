import React, { useState } from 'react';
import ClientesList from './components/ClientesList';
import TicketsList from './components/TicketsList';
import TecnicosList from './components/TecnicosList';

export default function App() {
  const [vista, setVista] = useState('clientes');

  // Mantenemos tu proyecto y tu clave tal cual
  const projectRef = "zazwmmveergrnriuhann";
  const apiKey = "sb_publishable_T89K9Qp4Cavh9rCma6LjjQ_9FphvF8e";
  
  // Definimos baseUrl para que la usen los componentes
  const baseUrl = `https://${projectRef}.supabase.co/rest/v1`;

  const headers = {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '700px', margin: '0 auto' }}>
      <h2>Panel Principal - CoreTech</h2>

      {/* Botones de navegación */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setVista('clientes')}
          style={{
            padding: '8px 16px',
            backgroundColor: vista === 'clientes' ? '#007bff' : '#e0e0e0',
            color: vista === 'clientes' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clientes
        </button>

        <button 
          onClick={() => setVista('tickets')}
          style={{
            padding: '8px 16px',
            backgroundColor: vista === 'tickets' ? '#007bff' : '#e0e0e0',
            color: vista === 'tickets' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Tickets
        </button>

        <button 
          onClick={() => setVista('tecnicos')}
          style={{
            padding: '8px 16px',
            backgroundColor: vista === 'tecnicos' ? '#007bff' : '#e0e0e0',
            color: vista === 'tecnicos' ? '#fff' : '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Técnicos
        </button>
      </div>

      <hr />

      {/* Renderizado condicional */}
      {vista === 'clientes' && <ClientesList baseUrl={baseUrl} headers={headers} />}
      {vista === 'tickets' && <TicketsList baseUrl={baseUrl} headers={headers} />}
      {vista === 'tecnicos' && <TecnicosList baseUrl={baseUrl} headers={headers} />}
    </div>
  );
}