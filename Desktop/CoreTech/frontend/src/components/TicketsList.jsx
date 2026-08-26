import React, { useEffect, useState } from 'react';

export default function TicketsList({ baseUrl, headers }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/Ticket?select=*`, { method: 'GET', headers })
      .then(res => res.json())
      .then(data => {
        setTickets(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando tickets...</p>;

  return (
    <div>
      <h4>Lista de Tickets ({tickets.length}):</h4>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map(ticket => (
            <li key={ticket.id_ticket}>
              Ticket #{ticket.id_ticket}: {ticket.problema} ({ticket.estado})
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tickets registrados.</p>
      )}
    </div>
  );
}