import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../axiosClient'; // Asegúrate de que axiosClient esté configurado correctamente
import { ModalFooter, Button, Input } from "@nextui-org/react";
import CategoriaContext from '../../context/CategoriaContext';

const FormCategoria = ({ mode, handleSubmit, onClose, actionLabel, initialData }) => {
    const [nombreCategoria, setNombreCategoria] = useState('');
    const [estadoCategoria, setEstadoCategoria] = useState('');

    useEffect(() => {
        if (mode === 'update' && initialData) {
            setNombreCategoria(initialData.nombre_categoria);
            setEstadoCategoria(initialData.estado);
        } 
    }, [mode, initialData]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                nombre_categoria: nombreCategoria,
                estado: estadoCategoria,
            };
            handleSubmit(formData, e);
        } catch (error) {
            console.log('Error submitting form: ', error);
            alert('Hay un error en el sistema: ' + error.message);
        }
    };

    return (
        <form method='post' onSubmit={handleFormSubmit}>
            <div className='ml-5 align-items-center'>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Nombre de la categoría'
                        id='nombre_categoria'
                        name="nombre_categoria"
                        value={nombreCategoria}
                        onChange={(e) => setNombreCategoria(e.target.value)}
                        required
                        pattern="^[a-zA-Z\s]{1,50}$"
                        title="El nombre de la categoría debe tener máximo 50 caracteres, y solo puede contener letras y espacios"
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="estado_categoria"
                        value={estadoCategoria}
                        onChange={(e) => setEstadoCategoria(e.target.value)}
                        required
                    >
                        <option value="" hidden>
                            Seleccionar Estado
                        </option>
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                    </select>
                </div>
                <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                        Close
                    </Button>
                    <Button type="submit" color="warning" className='text-white p-2'>
                        {actionLabel}
                    </Button>
                </ModalFooter>
            </div>
        </form>
    );
};

export default FormCategoria;
