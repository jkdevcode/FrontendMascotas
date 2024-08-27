import React, { useContext, useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Image, Chip, ModalFooter } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import axiosClient from '../axiosClient';
import MascotasContext from '../../context/MascotasContext';
import Swal from 'sweetalert2';

function ListMascota({ initialData, onClose }) {
    const { mascotas, setMascotas } = useContext(MascotasContext);
    const [vacunas, setVacunas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchVacunas = async () => {
            try {
                const response = await axiosClient.get(`/vacunas/listar/${initialData.id_mascota}`);
                setVacunas(response.data);
            } catch (error) {
                console.error('Error al listar vacunas:', error);
            }
        };

        fetchVacunas();
    }, [initialData.id_mascota]);

    const handleAdoptar = async () => {
        try {
            // Obtener el id_usuario desde el localStorage (verifica que estés guardando correctamente el usuario)
            const user = JSON.parse(localStorage.getItem('user'));
            const id_usuario = user?.id_usuario; // Accede a id_usuario desde el objeto user
            
            console.log("El id_usuario es:", id_usuario);
    
            // Realiza la solicitud al backend
            const response = await axiosClient.post(`/adopciones/iniciar/${initialData.id_mascota}`, { id_usuario });
            
            console.log("Respuesta del servidor:", response);
    
            if (response.status === 200) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Mascota puesta en proceso de adopción',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setMascotas();
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Error al poner en proceso de adopción',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error('Error al iniciar adopción:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al poner en proceso de adopción',
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
            });
        }
    };
    
    
    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
    
        let ageYears = today.getFullYear() - birth.getFullYear();
        let ageMonths = today.getMonth() - birth.getMonth();
    
        if (ageMonths < 0) {
          ageYears--;
          ageMonths += 12;
        }
    
        if (today.getDate() < birth.getDate()) {
          ageMonths--;
          if (ageMonths < 0) {
            ageYears--;
            ageMonths += 12;
          }
        }
    
        return { years: ageYears, months: ageMonths };
      };
    
      // Calcula la edad
      const { years, months } = calculateAge(initialData.fecha_nacimiento);

    return (
        <>
            <Card className="py-2 bg-gray-200">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="font-bold text-large">Nombre: {initialData.nombre_mascota}</h4>
                    <small className="text-default-500">Sexo: {initialData.sexo}</small>
                    <h4 className="font-bold text-large">Raza: {initialData.raza}</h4>
                    <small className="text-default-500">Especie: {initialData.categoria}</small>
                    <h4 className="font-bold text-large">Edad: {years} Años y {months} Meses</h4>
                    <h4 className="font-bold text-large">Esterilización: {initialData.esterilizado}</h4>
                    <h4 className="font-bold text-large">Departamento: {initialData.departamento}</h4>
                    <h4 className="font-bold text-large">Municipio: {initialData.municipio}</h4>
                    <h4 className="font-bold text-large">Tamaño: {initialData.tamano}</h4>
                    <h4 className="font-bold text-large">Peso: {initialData.peso}</h4>
                    <Chip className="capitalize" color={statusColorMap[initialData.estado]} size="xs" variant="flat">
                        {initialData.estado}
                    </Chip>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                    <div className="relative w-full h-62 mb-4 overflow-hidden">
                        {initialData.imagenes && initialData.imagenes.length > 0 ? (
                            <div className={`grid ${initialData.imagenes.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                                {initialData.imagenes.map((imagen, index) => (
                                    <div key={index} className={`flex items-center justify-center ${initialData.imagenes.length === 1 && index === 0 ? 'col-span-2' : ''}`}>
                                        <Image
                                            alt={`Imagen ${index + 1}`}
                                            className="object-cover w-full h-full"
                                            src={`${axiosClient.defaults.baseURL}/uploads/${imagen}`}
                                            width='auto'
                                            height='auto'
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Image
                                alt="Imagen por defecto"
                                className="object-cover w-full h-full"
                                src="https://nextui.org/images/hero-card-complete.jpeg"
                                width='auto'
                                height='auto'
                            />
                        )}
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-4">{initialData.descripcion}</p>
                    {/* <p className="text-sm text-gray-700 font-medium mb-4">Edad: {initialData.edad} años</p> */}
                    <div className="mt-2 flex flex-wrap justify-between">
                        {vacunas.length > 0 ? (
                            vacunas.map((vacuna) => (
                                <div
                                    key={vacuna.id_vacuna}
                                    className="mb-4 w-1/2 px-2"
                                >
                                    <div className="border p-4 rounded">
                                        <h5 className="font-bold">Enfermedad: {vacuna.enfermedad}</h5>
                                        <p>Fecha: {formatDate(vacuna.fecha_vacuna)}</p>
                                        <p>Estado: {vacuna.estado}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-700 font-medium mb-4">Esta mascota no tiene vacunas.</p>
                        )}
                    </div>
                </CardBody>
            </Card>
            <ModalFooter>
                <Button color="danger" onClick={onClose}>Cancelar</Button>
                <Button color="warning" className="z-1 text-white" onClick={handleAdoptar}>
                    ¡Adoptame!
                </Button>
            </ModalFooter>
        </>
    );
}

export default ListMascota;
