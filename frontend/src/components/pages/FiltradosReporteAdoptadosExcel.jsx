// src/components/ReporteMascotas.js

import React, { useState, useEffect } from "react";
import Header from '../moleculas/Header.jsx';
import axiosClient from '../axiosClient.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";



const FiltradosReporteAdoptadosEXCEL = () => {
  const [tipoFecha, setTipoFecha] = useState("dia"); // 'dia', 'mes', 'rango'
  const [idMascota, setIdMascota] = useState("");
  const [fechaDia, setFechaDia] = useState(new Date());
  const [fechaMes, setFechaMes] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(new Date());
  const [fechaFin, setFechaFin] = useState(new Date());
  const [categorias, setCategorias] = useState([]);
  const [razas, setRazas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [razaSeleccionada, setRazaSeleccionada] = useState("");

  // Obtener categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axiosClient.get("/categorias/listar"); // Asegúrate de que esta ruta exista
        setCategorias(res.data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  // Obtener razas cuando cambia la categoría
  useEffect(() => {
    const fetchRazas = async () => {
      try {
        if (categoriaSeleccionada) {
          const res = await axiosClient.get(`/razas/listar?/categorias/listar=${categoriaSeleccionada}`); // Asegúrate de que este endpoint filtre por categoría
          setRazas(res.data);
        } else {
          setRazas([]);
        }
      } catch (error) {
        console.error("Error al obtener razas:", error);
      }
    };

    fetchRazas();
  }, [categoriaSeleccionada]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Construir los parámetros de la consulta
    let params = { tipo_fecha: tipoFecha, id_mascota: idMascota };
  
    if (tipoFecha === "dia") {
      params.fecha_inicio = fechaDia.toISOString().split("T")[0];
    } else if (tipoFecha === "mes") {
      params.fecha_inicio = moment(fechaMes).format("MM-YYYY"); // Formato 'MM-YYYY'
    } else if (tipoFecha === "rango") {
      params.fecha_inicio = moment(fechaInicio).format("YYYY-MM-DD");
      params.fecha_fin = moment(fechaFin).format("YYYY-MM-DD");
    }
  
    if (categoriaSeleccionada) {
      params.categoria = categoriaSeleccionada;
    }
  
    if (razaSeleccionada) {
      params.raza = razaSeleccionada;
    }
  
    try {
      const res = await axiosClient.get("/reportesEXCEL2/reporte_excel", {
        params,
        responseType: "blob", // Importante para recibir el PDF
      });
  
    // Crear un enlace para descargar el archivo Excel
    const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Reporte_Mascotas_${Date.now()}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Error al generar el reporte:", error);
    alert("No se pudo generar el reporte. Por favor, verifica los filtros.");
  }
};

  
  return (
    <div className="flex flex-col items-center justify-center">
      <Header title="Reporte de Mascotas Adoptadas" />
      <div className="w-full max-w-4xl bg-white shadow-custom rounded-lg p-8 mt-16">

        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Generar Reporte de Mascotas Adoptadas</h2>
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div className="flex flex-col space-y-2">
        <label className="text-lg font-medium text-gray-800">ID de Mascota:</label>
        <input
            type="text"
            value={idMascota}
            onChange={(e) => setIdMascota(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
        />
    </div>


                <div className="flex flex-col space-y-2">
                <label className="text-lg font-medium text-gray-800">Tipo de Fecha:</label>
                <select
                    value={tipoFecha}
                    onChange={(e) => setTipoFecha(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
                >
                    <option value="dia">Día</option>
                    <option value="mes">Mes</option>
                    <option value="rango">Rango de Fechas</option>
                </select>
                </div>

                    
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-medium text-gray-800">Categoría:</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
              >
                <option value="">Todas</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
    
                {tipoFecha === "dia" && (
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-medium text-gray-800">Selecciona el Día:</label>
                    <DatePicker
    selected={fechaDia}
    onChange={(date) => setFechaDia(date)}
    dateFormat="yyyy-MM-dd"
    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
    />

                </div>
                )}
    
                {tipoFecha === "mes" && (
                <div className="flex flex-col space-y-2">
                    <label className="text-lg font-medium text-gray-800">Selecciona el Mes:</label>
                    <DatePicker
    selected={fechaMes}
    onChange={(date) => setFechaMes(date)}
    dateFormat="MM-yyyy"
    showMonthYearPicker
    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
    />

                </div>
                )}
    
    {tipoFecha === "rango" && (
  <div className="flex flex-col space-y-2">

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Contenedor para alinear los inputs */}
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-medium text-gray-800">Fecha de Inicio:</label>
        <DatePicker
          selected={fechaInicio}
          onChange={(date) => setFechaInicio(date)}
          dateFormat="yyyy-MM-dd"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
        />
      </div>
      <div className="flex flex-col space-y-2">
        <label className="text-lg font-medium text-gray-800">Fecha de Fin:</label>
        <DatePicker
          selected={fechaFin}
          onChange={(date) => setFechaFin(date)}
          dateFormat="yyyy-MM-dd"
          className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
        />
      </div>
    </div>
  </div>
)}


  
            <div className="flex flex-col space-y-2">
              <label className="text-lg font-medium text-gray-800">Raza:</label>
              <select
                value={razaSeleccionada}
                onChange={(e) => setRazaSeleccionada(e.target.value)}
                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-warning-500 focus:border-warning-500 transition duration-300"
              >
                <option value="">Todas</option>
                {razas.map((raza) => (
                  <option key={raza.id_raza} value={raza.id_raza}>
                    {raza.nombre_raza}
                  </option>
                ))}
              </select>
            </div>
          </div>
  
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Generar Reporte EXCEL
          </button>

        </form>
      </div>
      
    </div>
  );
  
  
};

export default FiltradosReporteAdoptadosEXCEL;
