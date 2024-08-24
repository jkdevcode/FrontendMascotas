import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../axiosClient';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import MunicipiosContext from '../../context/MunicipiosContext';

const FormMunicipios = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [departamentos, setDepartamentos] = useState([]);
    const [nombreMunicipio, setNombreMunicipio] = useState('');
    const [codigoDane, setCodigoDane] = useState('');
    const [departamentoFK, setDepartamentoFk] = useState('');

    const { idMunicipio } = useContext(MunicipiosContext);

    useEffect(() => {
        // Obtener departamentos disponibles para asociar con el municipio
        axiosClient.get('/departamentos/listar').then((response) => {
            setDepartamentos(response.data);
        }).catch((error) => {
            console.log('Error fetching departments: ', error);
        });
    }, []);

    useEffect(() => {
        if (mode === 'update' && idMunicipio) {
            setNombreMunicipio(idMunicipio.nombre_municipio);
            setCodigoDane(idMunicipio.codigo_dane);
            setDepartamentoFk(idMunicipio.fk_id_departamento);
        }
    }, [mode, idMunicipio]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                nombre_municipio: nombreMunicipio,
                codigo_dane: codigoDane,
                fk_id_departamento: departamentoFK,
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
                        label='Nombre del Municipio'
                        id='nombre_municipio'
                        name="nombre_municipio"
                        value={nombreMunicipio}
                        onChange={(e) => setNombreMunicipio(e.target.value)}
                        required
                        pattern="^[a-zA-Z\s]{1,50}$"
                        title="El nombre del municipio debe tener máximo 50 caracteres, y solo puede contener letras y espacios"
                    />
                </div>
                <div className="py-2">
                    <Input
                        className='w-80'
                        color='warning'
                        variant="bordered"
                        type="text"
                        label='Código DANE'
                        id='codigo_dane'
                        name="codigo_dane"
                        value={codigoDane}
                        onChange={(e) => setCodigoDane(e.target.value)}
                        required
                        pattern="^\d{1,10}$"
                        title="El código DANE debe tener máximo 10 caracteres numéricos"
                    />
                </div>
                <div className='py-2'>
                    <select
                        className="pl-2 pr-4 py-2 w-11/12 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                        name="fk_id_departamento"
                        value={departamentoFK}
                        onChange={(e) => setDepartamentoFk(e.target.value)}
                        required
                    >
                        <option value="" hidden>
                            Seleccionar Departamento
                        </option>
                        {departamentos.map(departamento => (
                            <option key={departamento.id_departamento} value={departamento.id_departamento}>
                                {departamento.nombre_departamento}
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

export default FormMunicipios;
