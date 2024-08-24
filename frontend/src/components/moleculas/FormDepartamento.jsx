import React, { useEffect, useState, useContext } from 'react';
import { ModalFooter, Button, Input } from "@nextui-org/react";
import DepartamentosContext from '../../context/DepartamentosContext';

const FormDepartamentos = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [nombreDepartamento, setNombreDepartamento] = useState('');
    const [codigoDane, setCodigoDane] = useState('');

    const { idDepartamento } = useContext(DepartamentosContext);

    useEffect(() => {
        if (mode === 'update' && idDepartamento) {
            setNombreDepartamento(idDepartamento.nombre_departamento);
            setCodigoDane(idDepartamento.codigo_dane);
        } 
    }, [mode, idDepartamento]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = {
                nombre_departamento: nombreDepartamento,
                codigo_dane: codigoDane,
            };
            handleSubmit(formData, e);
        } catch (error) {
            console.log(error);
            alert('Hay un error en el sistema: ' + error);
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
                        label='Nombre del Departamento'
                        id='nombre_departamento'
                        name="nombre_departamento"
                        value={nombreDepartamento}
                        onChange={(e) => setNombreDepartamento(e.target.value)}
                        required
                        pattern="^[a-zA-Z\s]{1,50}$"
                        title="El nombre del departamento debe tener máximo 50 caracteres, y solo puede contener letras y espacios"
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

export default FormDepartamentos;
