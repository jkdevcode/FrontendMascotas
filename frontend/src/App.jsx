import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import React from "react";

import Inicio from './components/pages/Inicio';
import RegistroUser from './components/pages/RegistroUser';
import IniciarSesion from './components/pages/IniciarSesion';
import DashboardUser from './components/pages/DashboardUser';
import { Mascotas } from "./components/pages/Mascota";
import GlobalProvider from "./context/GlobalContext";
import { ListsMascotas } from "./components/pages/ListsMascotas";
import NotificacionesMascotas from "./components/pages/NotificacionesMascotas";
import PerfilUsuario from "./components/pages/Perfil";
import Graficas from "./components/pages/Grafica";
import Usuarios from "./components/pages/Usuarios";
import Razas from "./components/pages/Razas";
import Municipios from "./components/pages/Municipios";
import Departamentos from "./components/pages/Departamentos";
import TabMascotas from "./components/pages/TabMascotas";
import TabNotificaciones from "./components/pages/TabNotificaciones";


function App() {
  const stored = localStorage.getItem('user')
  const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

  return (
    <>
      <BrowserRouter >
        <GlobalProvider>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/iniciosesion" element={<IniciarSesion />} />
            <Route path="/registro" element={<RegistroUser />} />

            {user && user.rol === 'superusuario' && (
              <>
                <Route path="/usuarios" element={<Usuarios />} />
                <Route path="/mascota" element={<Mascotas />} />
                <Route path="/razas" element={<Razas />} />
                <Route path="/municipios" element={<Municipios />} />
                <Route path="/departamentos" element={<Departamentos />} />
                <Route path="/mascotas" element={<TabMascotas />} />
                <Route path="/notificaciones" element={<TabNotificaciones />} />
                {/* Vista de vacunas */}
                {/* Vista de Categorias */}
                {/* Vista de PDF */}
                {/* Vista de cambio de rol */}
                <Route path="/notificacionesmascotas" element={<NotificacionesMascotas />} />
                <Route path="/graficas" element={<Graficas />} />
              </>
            )}
            {user && user.rol === 'administrador' && (
              <>
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/graficas" element={<Graficas />} />
                <Route path="/perfil" element={<PerfilUsuario />} />
              </>
            )}
            {user && user.rol === 'usuario' && (
              <>
                <Route path="/iniciouser" element={<DashboardUser />} />
                <Route path="/listmascotas" element={<ListsMascotas />} />
                <Route path="/perfil" element={<PerfilUsuario />} />
              </>
            )}
          </Routes >
        </GlobalProvider>
      </BrowserRouter >
    </>
  )
}

export default App;
