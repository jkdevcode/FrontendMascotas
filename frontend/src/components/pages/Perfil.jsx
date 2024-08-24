import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Tooltip, Button, Avatar } from "@nextui-org/react";
import axiosClient from '../axiosClient';
import Icon from '../atomos/IconVolver';
import { FaUserCircle } from 'react-icons/fa';
import PerfilModal from '../templates/PerfilModal';
import iconos from '../../styles/iconos';

const PerfilUsuario = () => {
  const [perfil, setPerfil] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [mode, setMode] = useState('update');
  const [showRequestSection, setShowRequestSection] = useState(false);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const refreshPerfil = async () => {
    await obtenerDatos(); // Obtén los datos más recientes
  };

  const obtenerDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.get(`/usuarios/perfil/${id_usuario}`, { headers: { token: token } });
      const data = response.data[0];
      
      const imageUrl = data && data.img
        ? `${axiosClient.defaults.baseURL}/uploads/${data.img}`
        : 'path/to/default-image.jpg';
      
      setPerfil({ ...data, imageUrl });
    } catch (error) {
      console.error("Error al obtener la información", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos enviados:', initialData);

    try {
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;

      if (mode === 'update') {
        const response = await axiosClient.put(`/usuarios/actualizar/${id_usuario}`, initialData);
        if (response.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Se actualizó con éxito la información",
            showConfirmButton: false,
            timer: 1500
          });
          refreshPerfil(); // Llama a la función para actualizar el perfil en la vista
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al actualizar la información",
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Error en el servidor",
        text: error.message,
        showConfirmButton: false,
        timer: 1500
      });
    } finally {
      setModalOpen(false); // Cierra el modal después de intentar actualizar
    }
  };

  const handleToggle = () => {
    setModalOpen(true);
    setMode('update');
    setInitialData(perfil); // Pasa los datos actuales del perfil al modal
  };

  const handleRequestRoleChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const id_usuario = JSON.parse(localStorage.getItem('user')).id_usuario;
      const response = await axiosClient.post(`/usuarios/solicitarCambioRol/${id_usuario}`, { headers: { token: token } });

        if (response.status === 200) {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Solicitud enviada",
                text: "Tu solicitud de cambio de rol ha sido enviada al Super-Usuario.",
                showConfirmButton: false,
                timer: 1500
            });
        }
    } catch (error) {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al enviar la solicitud",
            text: error.message,
            showConfirmButton: false,
            timer: 1500
        });
    }
};


  return (
    <>
      <div className="flex flex-col items-center p-8 w-full">
        <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-10 h-14 bg-zinc-300 shadow-md max-w-screen-xxl flex-wrap mx-auto p-4">
          <h1 className="text-3xl font-semibold text-blue-400">Perrfect Match</h1>
          <div className="flex items-center space-x-4">
            <Tooltip content="Ir al perfil">
              <div 
                className="text-black shadow-xl flex items-center py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white cursor-pointer"
                onClick={() => navigate('/perfil')}
              >
                <FaUserCircle className="w-5 h-5" />
              </div>
            </Tooltip>
            <Tooltip content="Salir">
              <div className="text-black shadow-xl flex items-center py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-blue-500 hover:text-white cursor-pointer" onClick={() => {
                const swalWithBootstrapButtons = Swal.mixin({
                  customClass: {
                    confirmButton: "btn btn-success",
                    cancelButton: "btn btn-danger",
                    actions: "gap-5"
                  },
                  buttonsStyling: false
                });

                swalWithBootstrapButtons.fire({
                  title: "¿Estás Seguro que deseas Cerrar Sesión?",
                  text: "",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Salir",
                  cancelButtonText: "Cancelar",
                  reverseButtons: true
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                  }
                });
              }}>
                <Icon className="w-5 h-5" icon={iconos.iconoSalir} />
              </div>
            </Tooltip>
          </div>
        </header>
      </div>

      {perfil && (
        <div className='my-12 flex justify-center'>
          <div className="flex flex-col items-center">
            <h6 className="text-4xl font-extrabold text-warning-500 mb-6">Tu Perfil</h6>
            <div 
              className="flex items-center mb-6 rounded-full p-1"
              style={{
                border: '2px solid #D1D5DB',
                transition: 'border-color 0.3s, border-width 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'orange';
                e.currentTarget.style.borderWidth = '4px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.borderWidth = '2px';
              }}>
              {perfil.img ? (
                <Avatar
                  src={perfil.img}
                  alt="Imagen de perfil"
                  css={{ 
                    borderRadius: "$full", 
                  }}
                  className="w-40 h-40 border-gray-800 hover:border-warning-500 transition-colors duration-300"
                />
              ) : (
                <FaUserCircle
                  size={150}
                  className="text-gray-400 border-4 border-gray-800 p-2 rounded-full bg-gray-100 w-36 h-36 hover:border-warning-500 transition-colors duration-300"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
              {[
                { label: "Nombre(s):", value: perfil.nombre },
                { label: "Apellidos:", value: perfil.apellido },
                { label: "Tipo de documento:", value: perfil.tipo_documento },
                { label: "Número de documento:", value: perfil.documento_identidad },
                { label: "Dirección:", value: perfil.direccion },
                { label: "Correo Electrónico:", value: perfil.correo },
                { label: "Teléfono:", value: perfil.telefono },
                { label: "Rol:", value: perfil.rol }
              ].map((item, index) => (
                <div  
                  key={index}
                  className="p-6 bg-white rounded-lg shadow-lg border border-gray-300 hover:border-2 hover:border-warning-500 transition-colors"
                >
                  <label className="font-semibold text-base text-gray-800">{item.label}</label>
                  <p className="text-lg text-gray-600">{item.value || "No disponible"}</p>
                </div>
              ))}
            </div>

<div className="mt-8">
        <Button
          auto
          flat
          color="warning"
          className='mt-4 text-white p-2 w-40'
          onClick={handleToggle}
          css={{ 
            borderRadius: "$full", 
            fontWeight: "bold", 
            fontSize: "1.125rem", 
            padding: "0.5rem 2rem"
          }}
        >
          Edita tu Perfil
        </Button>
      </div>

            {/* Sección para solicitar cambio de rol */}
            {perfil.rol !== 'Super-Usuario' && (
              <div className="mt-8 text-center">
                <p className="text-lg font-medium text-gray-700">¿Deseas solicitar un cambio de rol superior?</p>
                <Button
                  color="error"
                  onClick={handleRequestRoleChange}
                  className="mt-4 text-white bg-blue-600 hover:bg-blue-500"
                >
                  Solicitar Cambio de Rol
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

{modalOpen && (
  <PerfilModal 
    open={modalOpen}  // Aquí se pasa correctamente el estado
    onClose={() => setModalOpen(false)}  // Función para cerrar el modal
    handleSubmit={handleSubmit}
    title="Editar Perfil"
    initialData={initialData}
    mode={mode}
    refreshPerfil={refreshPerfil}
  />
)}

    </>
  );
};

export default PerfilUsuario;
