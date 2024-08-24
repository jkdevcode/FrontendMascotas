import React, { useEffect, useState } from 'react';
import iconos from '../../styles/iconos';
import Icon from '../atomos/IconVolver';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import AccionesModal from '../organismos/ModalAcciones';
import PerfilModal from '../templates/PerfilModal';
import { Tooltip, Card, Button } from "@nextui-org/react";
import axiosClient from '../axiosClient';

const PerfilUsuario = () => {

  const [perfil, setPerfil] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAcciones, setModalAcciones] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [mode, setMode] = useState('create');

  const ObtenerDatos = async () => {
    try {
      const token = localStorage.getItem("token");
      const getURL = "http://localhost:3000/usuarios/listar";
      const response = await axiosClient.get(getURL, { headers: { token: token } });
      console.log(response.data);
      setPerfil(response.data.data);
    } catch (error) {
      console.error("Error al obtener la información", error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    ObtenerDatos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);

    try {
      const id_usuario = JSON.parse(localStorage.getItem('user'));

      if (mode === 'update') {
        console.log(id_usuario);
        await axiosClient.put(`/usuario/perfilactualizar/${id_usuario.identificacion}`, formData).then((response) => {
          console.log(response);
          if (response.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Se actualizó con éxito la información",
              showConfirmButton: false,
              timer: 1500
            });
            ObtenerDatos();
          } else {
            alert('Error al actualizar');
          }
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.log('Error en el servidor ', error);
      alert('Error en el servidor');
    }
  };

  const handleToggle = (mode, initialData) => {
    setInitialData(initialData);
    setModalOpen(true);
    setMode(mode);
  };

  return (
    <>
      {perfil && (
        <div className='my-12 flex justify-center'>
          <Card css={{ maxWidth: "1100px" }} className="bg-white rounded-2xl">
            <div className="p-10">
              <div className="flex flex-col items-start">
                <h4 className="mb-4 text-3xl font-semibold">{perfil.nombres} {perfil.apellidos}</h4>
                <div className="flex items-center mb-4">
                  <Button auto flat color="warning" onClick={() => handleToggle('update', perfil)}>
                    Actualizar
                  </Button>
                </div>
              </div>

              <div className="my-4 border-b-2 border-gray-300" />
              <h6 className="text-xl font-semibold">Información del Usuario:</h6>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="font-medium text-lg">Identificación:</label>
                  <p>{perfil.identificacion}</p>
                </div>
                <div>
                  <label className="font-medium text-lg">Nombres:</label>
                  <p>{perfil.nombres}</p>
                </div>
                <div>
                  <label className="font-medium text-lg">Apellidos:</label>
                  <p>{perfil.apellidos}</p>
                </div>
                <div>
                  <label className="font-medium text-lg">Correo Electrónico:</label>
                  <p>{perfil.correo}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <AccionesModal
        isOpen={modalAcciones}
        onClose={() => setModalAcciones(false)}
        label={mensaje}
      />
      <PerfilModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={mode === 'update' ? 'Actualizar Información de Usuario' : ' Actualizar Perfil'}
        actionLabel={mode === 'update' ? 'Actualizar' : 'Actualizar'}
        initialData={initialData}
        handleSubmit={handleSubmit}
        mode={mode}
      />
    </>
  );
};

export default PerfilUsuario;
