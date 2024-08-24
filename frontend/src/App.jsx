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

import Graficas from "./components/pages/Grafica";
import Usuarios from "./components/pages/Usuarios";
import Razas from "./components/pages/Razas";
import Municipios from "./components/pages/Municipios";
import Departamentos from "./components/pages/Departamentos";
import TabMascotas from "./components/pages/TabMascotas";
import TabNotificaciones from "./components/pages/TabNotificaciones";

//importaciones canacue, las vistas de las notificaciones del usuario y el super-usuario y el perfil 
//el perfil seria el mismo para todos, pero solo cree un archivo de perfil 
// y en ese esta el boton para solicitar el cambio de rol, entonces toca acomodarlo para que a los administradores 
// y al super usuario no les aparsca en el perfil el boton para solicitar el cambio de rol si no que solo al usuario
// ya la informacion y lo de editar el perfil, es lo mismo para todos

//vea mono esta es la vista de las notificaciones que le aparece al super-usuario:
import { Notificaciones } from "./components/pages/Notificaciones";
//esta es la vista de perfil:
import PerfilUsuario from "./components/pages/Perfil";
//esta es la vista de las notificaciones del usuario:
import { NotificacionesUsuario } from "./components/pages/NotificacionesUsuario";
// entonces para las notificaciones tambien hay que acomadarlo para que al usuario le aparesca las notificaciones de el
// y al super-usuario las notificaciones de el
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

                {/* estas son las rutas del super-usuario: el perfil y las notificaciones de el */}
                <Route path="/notificaciones" element={<Notificaciones />} />
                <Route path="/perfil" element={<PerfilUsuario />} />

              </>
            )}
            {user && user.rol === 'administrador' && (
              <>
                <Route path="/mascotas" element={<Mascotas />} />
                <Route path="/graficas" element={<Graficas />} />
                {/* esta es la ruta para el administrador: el perfil */}
                <Route path="/perfil" element={<PerfilUsuario />} />
              </>
            )}
            {user && user.rol === 'usuario' && (
              <>
                <Route path="/iniciouser" element={<DashboardUser />} />
                <Route path="/listmascotas" element={<ListsMascotas />} />

                {/*estas son las rutas del usuario: el perfil y las notificaciones del usuario */}
                <Route path="/notificacionesusuario" element={<NotificacionesUsuario />} />
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
