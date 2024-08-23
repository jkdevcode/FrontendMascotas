import React from 'react';
import Navigation from './Navigation';
import ButtonCerrarSesion from './ButtonCerrarSesion';

const Header = () => {
    return (
        <header className="top-0 left-0 right-0 z-10 flex justify-between items-center px-10 h-14 bg-zinc-300 shadow-md max-w-screen-xxl flex-wrap mx-auto">
            <h1 className="text-3xl font-semibold text-blue-400">Perrfect Match</h1>
            <Navigation />
            <ButtonCerrarSesion />
        </header>
    );
};

export default Header;
