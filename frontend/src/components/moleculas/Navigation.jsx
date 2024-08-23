import React from 'react';
import { Link } from '@nextui-org/react';

const Navigation = () => {


    const stored = localStorage.getItem('user')
    const user = stored && stored !== 'undefined' ? JSON.parse(stored) : null;

    return (
        <nav className="flex-grow flex justify-center space-x-24">
            {user && user.rol === 'superusuario' && (
                <>
                    <Link href="/usuarios" color="default" className="mx-2 text-lg cursor-pointer">Usuarios</Link>
                    <Link href="/mascotas" color="default" className="mx-2 text-lg cursor-pointer">Mascotas</Link>
                    <Link href="/notificaciones" color="default" className="mx-2 text-lg cursor-pointer">Notificaciones</Link>
                    <Link href="/graficas" color="default" className="mx-2 text-lg cursor-pointer">Graficas</Link>
                </>
            )}
            {user && user.rol === 'administrador' && (
                <Link href="/mascotas" color="default" className="mx-2 text-lg cursor-pointer">Mascotas</Link>
            )}
        </nav>
    );
};

export default Navigation;
