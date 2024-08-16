import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../axiosClient'; // Asegúrate de que axiosClient esté configurado correctamente
import { ModalFooter, Button, Input } from "@nextui-org/react";
import RazasContext from '../../context/RazasContext';

const FormRazas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [categorias, setCategorias] = useState([]);
    const [nombreRaza, setNombreRaza] = useState('');
    const [categoriaFK, setCategoriaFk] = useState('');

    const { idRaza } = useContext(RazasContext);

    useEffect(() => {
        // Obtener categorías disponibles para asociar con la raza
        axiosClient.get('/categorias/listar').then((response) => {
            setCategorias(response.data);
        }).catch((error) => {
            console.log('Error fetching categories: ', error);
        });
    }, []);

    useEffect(() => {
        if (mode === 'update' && idRaza) {
            console.log('idRaza:', idRaza); 
            setNombreRaza(idRaza.nombre_raza);
            setCategoriaFk(idRaza.fk_id_categoria);
        } else if (mode === 'create') {
            setNombreRaza('');
            setCategoriaFk('');
        }
    }, [mode, idRaza]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                nombre_raza: nombreRaza,
                fk_id_categoria: categoriaFK,
            };
            handleSubmit(formData, e);
        } catch (error) {
            console.log(error);
            alert('Hay un error en el sistema ' + error);
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
                        label='Nombre de la Raza'
                        id='nombre_raza'
                        name="nombre_raza"
                        value={nombreRaza}
                        onChange={(e) => setNombreRaza(e.target.value)}
                        required
                        pattern="^[a-zA-Z\s]{1,50}$"
                        title="El nombre de la raza debe tener máximo 50 caracteres, y solo puede contener letras y espacios"
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="nombre_categoria"
                        value={categoriaFK}
                        onChange={(e) => setCategoriaFk(e.target.value)}
                        required
                    >
                        <option value="" hidden>
                            Seleccionar Categoría
                        </option>
                        {categorias.map(categoria => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre_categoria}
                            </option>
                        ))}
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

export default FormRazas;
