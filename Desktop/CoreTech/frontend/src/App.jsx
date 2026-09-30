import React, { useEffect, useState } from "react";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ClientePortal from "./components/ClientePortal";

function App() {
  const [vista, setVista] = useState("login");
  const [usuarioActual, setUsuarioActual] = useState(null);

  const [listaUsuarios, setListaUsuarios] = useState(() => {
    const guardados = localStorage.getItem("usuarios_registrados");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [dbStatus, setDbStatus] = useState("Conectando...");

  const projectRef = "zazwmmveergrnriuhann";
  const baseUrl = `https://${projectRef}.supabase.co/rest/v1`;
  const apiKey = "sb_publishable_T89K9Qp4Cavh9rCma6LjjQ_9FphvF8e";

  const headers = {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  useEffect(() => {
    fetch(`${baseUrl}/Cliente?select=*`, {
      method: "GET",
      headers
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        setDbStatus(
          `Conexión exitosa. Se cargaron ${
            Array.isArray(data) ? data.length : 0
          } registros.`
        );
      })
      .catch((error) => {
        console.error("Error al conectar con Supabase:", error);
        setDbStatus(`Error al conectar: ${error.message}`);
      });
  }, [baseUrl]);

  const agregarNuevoUsuario = (nuevoUsuario) => {
    const usuariosActualizados = [...listaUsuarios, nuevoUsuario];
    setListaUsuarios(usuariosActualizados);
    localStorage.setItem(
      "usuarios_registrados",
      JSON.stringify(usuariosActualizados)
    );
  };

  // MANEJO DE LOGIN
  const manejarLogin = (usuario) => {
    setUsuarioActual(usuario);

    // Normalizamos el rol a minúsculas ("usuario", "cliente", "tecnico", "admin", etc.)
    const rolNormalizado = (usuario?.rol || "").toLowerCase();

    // Si el rol es cliente o usuario sin especificar, lo enviamos al portal de cliente
    if (rolNormalizado === "cliente" || rolNormalizado === "usuario" || rolNormalizado === "") {
      setVista("cliente");
    } else {
      setVista("dashboard");
    }
  };

  // PORTAL CLIENTE
  if (vista === "cliente") {
    return (
      <ClientePortal
        usuario={usuarioActual}
        onLogout={() => {
          setUsuarioActual(null);
          setVista("login");
        }}
      />
    );
  }

 // DASHBOARD ADMIN / TÉCNICO
if (vista === "dashboard") {
  return (
    <Dashboard
      usuario={usuarioActual} // 👈 ¡AGREGA ESTA LÍNEA AQUÍ!
      onLogout={() => {
        setUsuarioActual(null);
        setVista("login");
      }}
      baseUrl={baseUrl}
      headers={headers}
    />
  );
}
  // REGISTRO
  if (vista === "registro") {
    return (
      <Register
        onIrALogin={() => setVista("login")}
        onRegistroExitoso={(usuarioCreado) => {
          // Asignamos el rol por defecto de 'usuario' al crearse
          const usuarioConRol = { ...usuarioCreado, rol: "usuario" };
          agregarNuevoUsuario(usuarioConRol);
          setUsuarioActual(usuarioConRol);
          
          // Lo enviamos directo a la vista de cliente
          setVista("cliente");
        }}
        baseUrl={baseUrl}
        headers={headers}
      />
    );
  }

  // PANTALLA PRINCIPAL DE LOGIN
  return (
    <Login
      onLogin={manejarLogin}
      onIrARegistro={() => setVista("registro")}
      usuariosRegistrados={listaUsuarios}
      baseUrl={baseUrl}
      headers={headers}
      dbStatus={dbStatus}
    />
  );
}

export default App;