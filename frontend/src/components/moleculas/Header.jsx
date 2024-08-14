import React from 'react';
import { Link } from '@nextui-org/react';
import iconos from '../../styles/iconos';
import Icon from '../atomos/IconVolver';
import { Tooltip } from "@nextui-org/react";
import Swal from 'sweetalert2';

const Header = ({ onLogout }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-10 h-14 bg-zinc-300 shadow-md max-w-screen-xxl flex-wrap mx-auto p-4">
            <h1 className="text-3xl font-semibold text-blue-400">Perrfect Match</h1>
            <nav className="flex-grow flex justify-center space-x-24">
                <Link href="/mascotas" color="default" className="mx-2 text-lg cursor-pointer">Registrar</Link>
                <Link href="/notificaciones" color="default" className="mx-2 text-lg cursor-pointer">Notificaciones</Link>
                <Link href="/graficas" color="default" className="mx-2 text-lg cursor-pointer">Graficas</Link>
            </nav>
            <Tooltip content="Salir">
                <div className="text-black shadow-xl flex items-center py-2 px-4 rounded-lg transition-colors duration-300 hover:bg-green hover:text-white cursor-pointer" onClick={() => {
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
                            onLogout();
                        }
                    });
                }}>
                    <Icon className="w-5 h-5" icon={iconos.iconoSalir} />
                </div>
            </Tooltip>
        </header>
    );
};

export default Header;
