import React from "react";
import Header from '../moleculas/Header.jsx';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Reportes = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/Filtrosreporte'); // Redirige a la vista de filtrados
  }

  const handleSubmit2 = (e) => {
    e.preventDefault();
    navigate('/Filtrosreporte2'); // Redirige a la vista de filtrados
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Header title="Reportes de Mascotas" />
      <div className="flex flex-col md:flex-row max-w-6xl w-full gap-8 mt-16">
        {/* Contenedor Izquierdo: Información y Botón */}
        <div className="flex-1 bg-white shadow-custom rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Generar Reportes de Mascotas en Adopción</h2>
          <p className="text-lg text-gray-700 mb-6">
            Este módulo te permite generar reportes detallados de mascotas en adopción por día, mes, o rango de fechas. 
            Puedes filtrar por categoría y raza, y generar reportes en formatos Excel y PDF.
          </p>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-warning-500 text-white font-bold rounded-lg shadow-md hover:bg-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-500 transition duration-300"
          >
            Filtrar y Generar Reportes
          </button>
        </div>

        {/* Contenedor Derecho: Información y Botón */}
        <div className="flex-1 bg-white shadow-custom rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">Generar Reportes de Mascotas Adoptadas</h2>
          <p className="text-lg text-gray-700 mb-6">
            Este módulo permite generar reportes detallados sobre las mascotas adoptadas. Puedes filtrar los reportes por código del animal, día, semana, rango de fechas, categoría y raza, y generar reportes en formatos Excel y PDF.
          </p>
          <button
          onClick={handleSubmit2}
            className="w-full py-3 bg-warning-500 text-white font-bold rounded-lg shadow-md hover:bg-warning-300 focus:outline-none focus:ring-2 focus:ring-warning-500 transition duration-300"
          >
            Filtrar y Generar Reportes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
