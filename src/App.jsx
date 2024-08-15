import { BrowserRouter, Route, Routes } from "react-router-dom"
import './App.css'
import React from "react";
/* import { DatePicker } from "@nextui-org/react"; */
import Inicio from './components/pages/Inicio';
import RegistroUser from './components/pages/RegistroUser';
import IniciarSesion from './components/pages/IniciarSesion';
import DashboardUser from './components/pages/DashboardUser';
import { Mascotas } from "./components/pages/Mascota";
import GlobalProvider from "./context/GlobalContext";
import { ListsMascotas } from "./components/pages/ListsMascotas";
import { Notificaciones } from "./components/pages/Notificaciones";
import PerfilUsuario from "./components/pages/Perfil";
import Graficas from "./components/pages/Grafica";
import Usuarios from "./components/pages/Usuarios";

// import { Notificaciones } from "./components/pages/notificaciones";




function App() {
  const stored = localStorage.getItem('user')
  const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;
  /* console.log('Usuario almacenado:', user); */


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
                <Route path="/mascotas" element={<Mascotas />} />
                {/* Vista de vacunas */}
                {/* Vista de Categorias */}
                {/* Vista de Razas */}
                {/* Vista de PDF */}
                {/* Vista de cambio de rol */}
                {/* Vista de departamento y municipios */}
                <Route path="/notificaciones" element={<Notificaciones />} />
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
