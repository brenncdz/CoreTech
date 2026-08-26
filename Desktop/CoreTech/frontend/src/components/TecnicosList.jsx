import React, { useEffect, useState } from 'react';

export default function TecnicosList({ baseUrl, headers }) {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/Tecnico?select=*`, { method: 'GET', headers })
      .then(res => res.json())
      .then(data => {
        setTecnicos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando técnicos...</p>;

  return (
    <div>
      <h4>Lista de Técnicos ({tecnicos.length}):</h4>
      {tecnicos.length > 0 ? (
        <ul>
          {tecnicos.map(tecnico => (
            <li key={tecnico.id_tecnico}>
              {tecnico.nombre} - {tecnico.especialidad}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay técnicos registrados.</p>
      )}
    </div>
  );
}