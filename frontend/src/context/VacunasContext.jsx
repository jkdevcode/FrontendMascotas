import React, { createContext, useState, useEffect } from 'react';
import axiosClient from '../components/axiosClient';

const VacunasContext = createContext();

export const VacunasProvider = ({ children }) => {
    const [vacunas, setVacunas] = useState([]);
    const [vacuna, setVacuna] = useState(null);
    const [idVacuna, setVacunaId] = useState(null);
    const [mascotas, setMascotas] = useState([]);

    // Función para obtener todas las vacunas
    const getVacunas = async () => {
        try {
            const response = await axiosClient.get('/vacunas/listar');
            setVacunas(response.data);
        } catch (error) {
            console.log('Error del servidor: ' + error);
        }
    };

    // Función para obtener una vacuna por ID
    const getVacuna = async (id_vacuna) => {
        try {
            const response = await axiosClient.get(`/vacunas/buscar/${id_vacuna}`);
            setVacuna(response.data);
        } catch (error) {
            console.log('Error: ' + error);
        }
    };

    // Función para obtener todas las mascotas
    const getMascotas = async () => {
        try {
            const response = await axiosClient.get('/mascotas/listar');
            setMascotas(response.data.filter(mascota => mascota.estado !== 'Adoptado'));
        } catch (error) {
            console.log('Error del servidor: ' + error);
        }
    };

    // Fetch inicial de datos
    useEffect(() => {
        getVacunas();
        getMascotas();
    }, []);

    return (
        <VacunasContext.Provider
            value={{
                vacunas,
                vacuna,
                idVacuna,
                setVacunas,
                setVacuna,
                setVacunaId,
                getVacunas,
                getVacuna,
                mascotas,
            }}
        >
            {children}
        </VacunasContext.Provider>
    );
};

export default VacunasContext;
