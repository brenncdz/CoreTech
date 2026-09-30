import logo from '../assets/logo.png';
function Sidebar({ paginaActual, cambiarPagina }) {
  const opciones = [
    { id: "inicio", icono: "🏠", nombre: "Inicio" },
    { id: "clientes", icono: "👥", nombre: "Clientes" },
    { id: "tecnicos", icono: "🔧", nombre: "Técnicos" },
    { id: "tickets", icono: "🎫", nombre: "Tickets" },
    { id: "configuracion", icono: "⚙️", nombre: "Configuración" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo CoreTech" className="logo-icon" />
        <div>
          <h2>CORETECH</h2>
          <span>Soporte técnico</span>
        </div>
      </div>

      <nav className="menu">
        {opciones.map((opcion) => (
          <button
            key={opcion.id}
            className={`menu-item ${
              paginaActual === opcion.id ? "activo" : ""
            }`}
            onClick={() => cambiarPagina(opcion.id)}
          >
            <span className="menu-icon">{opcion.icono}</span>
            <span>{opcion.nombre}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="usuario">
          <div className="usuario-avatar">U</div>
          <div>
            <strong>Usuario</strong>
            <span>Administrador</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;