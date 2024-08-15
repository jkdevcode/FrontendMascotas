import React from 'react';
import { Link } from '@nextui-org/react';

const Navigation = () => {
    return (
        <nav className="flex-grow flex justify-center space-x-24">
            <Link href="/usuarios" color="default" className="mx-2 text-lg cursor-pointer">Usuarios</Link>
            <Link href="/mascotas" color="default" className="mx-2 text-lg cursor-pointer">Mascotas</Link>
            <Link href="/notificaciones" color="default" className="mx-2 text-lg cursor-pointer">Notificaciones</Link>
            <Link href="/graficas" color="default" className="mx-2 text-lg cursor-pointer">Graficas</Link>
        </nav>
    );
};

export default Navigation;
