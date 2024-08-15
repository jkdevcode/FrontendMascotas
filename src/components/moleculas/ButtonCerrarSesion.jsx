import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from "@nextui-org/react";
import Icon from '../atomos/IconVolver';
import Swal from 'sweetalert2';
import iconos from '../../styles/iconos';

const ButtonCerrarSesion = () => {

    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/');
    };
    const handleLogout = () => {
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
                // Llama a la función de logout aquí
                logout(); // Asegúrate de que `logout` esté disponible en el contexto
            }
        });
    };

    return (
        <Tooltip content="Salir">
            <div className="text-black shadow-xl flex items-center py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green hover:text-white cursor-pointer" onClick={handleLogout}>
                <Icon className="w-5 h-5" icon={iconos.iconoSalir} />
            </div>
        </Tooltip>
    );
};

export default ButtonCerrarSesion;
