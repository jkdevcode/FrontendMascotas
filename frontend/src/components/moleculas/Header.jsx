/* import React from 'react';
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
 */

import { Sidebar } from "../organismos/Sidebar.jsx";
import { SideBarUser } from "../organismos/SideBarUser.jsx";

const Header = (props) => {
    return(
        <div className="bg-[#dc7633] w-full h-20 flex justify-between shadow-3xl shadow-gray-900 border-b-2 border-gray-300">
            <Sidebar />
            <h2 className="text-white text-2xl font-bold flex items-center">
                {props.title}
            </h2>
            <SideBarUser />
        </div>
    )
}

export default Header;