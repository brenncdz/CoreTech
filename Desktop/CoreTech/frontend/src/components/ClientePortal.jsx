import React, { useState, useEffect } from "react";
import "./ClientePortal.css";
import { supabase } from "../supabaseClient";

function ClientePortal({ usuario, onLogout }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("Redes");
  const [prioridad, setPrioridad] = useState("Media");
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Obtener ID del cliente activo de forma flexible
  const idCliente = usuario?.id_cliente || usuario?.id || usuario?.id_usuario;

  // Cargar ÚNICAMENTE los tickets del cliente actual desde Supabase
  const fetchTickets = async () => {
    // Si no hay ID de cliente válido, no muestra nada (evita filtrar todos los tickets)
    if (!idCliente) {
      console.warn("No se detectó el ID del cliente logueado.");
      setTickets([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("Ticket")
        .select("*")
        .eq("id_cliente", idCliente)
        .order("id_ticket", { ascending: false });

      if (error) {
        console.error("Error al consultar tickets del cliente:", error);
      } else {
        setTickets(data || []);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [usuario]);

  // Enviar ticket vinculado estrictamente al cliente actual
  const enviarTicket = async (e) => {
    e.preventDefault();

    if (!idCliente) {
      alert("Error de sesión: No se pudo verificar la identidad del cliente. Por favor vuelve a iniciar sesión.");
      return;
    }

    if (!titulo.trim() || !descripcion.trim()) {
      alert("Por favor completa el título y la descripción.");
      return;
    }

    setCargando(true);

    try {
      const payload = {
        problema: `${titulo}\n${descripcion}`,
        estado: "En Espera",
        id_cliente: idCliente,
        prioridad: prioridad,
        categoria: categoria
      };

      const { data, error } = await supabase
        .from("Ticket")
        .insert([payload])
        .select();

      if (error) {
        console.error("Error al guardar ticket:", error);
        alert(`Error al enviar el ticket: ${error.message}`);
      } else {
        alert("¡Incidente enviado con éxito!");
        setTitulo("");
        setDescripcion("");
        setCategoria("Redes");
        setPrioridad("Media");
        fetchTickets(); // Actualiza la lista del cliente
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      alert("Ocurrió un error al procesar el envío.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="cliente-page">
      <header className="cliente-header">
        <div className="cliente-logo">
          <div className="logo-cuadrado">✓</div>
          <div>
            <strong>CoreTech</strong>
            <span>PORTAL DEL CLIENTE</span>
          </div>
        </div>

        <div className="cliente-usuario">
          <div className="usuario-circulo">C</div>
          <span>
            {usuario?.nombre || usuario?.name || usuario?.usuario || "Cliente"}
          </span>
          <button onClick={onLogout}>SALIR</button>
        </div>
      </header>

      <main className="cliente-contenido">
        <section className="seccion-reporte">
          <div className="titulo-seccion">
            <h1>REPORTAR INCIDENTE</h1>
            <p>Completá el formulario y nuestro equipo atenderá tu solicitud.</p>
          </div>

          <form className="formulario-ticket" onSubmit={enviarTicket}>
            <div className="linea-formulario">
              <span>NUEVO TICKET</span>
            </div>

            <label>
              TÍTULO / ASUNTO
              <input
                type="text"
                placeholder="Ej: No puedo acceder al sistema"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </label>

            <label>
              DESCRIPCIÓN DEL PROBLEMA
              <textarea
                placeholder="Describí el problema con el mayor detalle posible..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </label>

            <div className="campos-dobles">
              <label>
                CATEGORÍA
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                  <option value="Redes">Redes</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Bases de Datos">Bases de Datos</option>
                  <option value="Cloud">Cloud</option>
                  <option value="Otros">Otros</option>
                </select>
              </label>

              <label>
                PRIORIDAD
                <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)}>
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Crítica">Crítica</option>
                </select>
              </label>
            </div>

            <button type="submit" className="boton-enviar" disabled={cargando}>
              ➤ &nbsp; {cargando ? "ENVIANDO..." : "ENVIAR INCIDENTE"}
            </button>
          </form>
        </section>

        <section className="mis-tickets">
          <div className="tickets-titulo">
            <div>
              <h2>MIS TICKETS</h2>
              <p>Seguimiento de tus incidentes reportados.</p>
            </div>
            <span>{tickets.length} registros</span>
          </div>

          {tickets.length === 0 ? (
            <div className="sin-tickets">
              <div className="icono-ticket">□</div>
              <p>Aún no has reportado ningún incidente.</p>
            </div>
          ) : (
            <div className="lista-tickets">
              {tickets.map((ticket) => (
                <div className="ticket-card" key={ticket.id_ticket || ticket.id}>
                  <div className="ticket-id">
                    INC-{String(ticket.id_ticket || ticket.id).padStart(3, "0")}
                  </div>
                  <div className="ticket-info">
                    <strong>{ticket.problema || ticket.titulo}</strong>
                    <span>
                      {ticket.categoria || "General"} · {ticket.prioridad || "Media"}
                    </span>
                    <small>
                      {ticket.fechaCreacion 
                        ? new Date(ticket.fechaCreacion).toLocaleDateString("es-ES")
                        : new Date().toLocaleDateString("es-ES")}
                    </small>
                  </div>
                  <div className={`estado ${(ticket.estado || "en_espera").toLowerCase().replace(/\s+/g, '_')}`}>
                    ● {(ticket.estado || "EN ESPERA").toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ClientePortal;