import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient.js';
import MascotasContext from '../../context/MascotasContext.jsx';
import {
    Input,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "../nextUI/PlusIcon.jsx";
import { SearchIcon } from "../nextUI/SearchIcon.jsx";
import { ChevronDownIcon } from "../nextUI/ChevronDownIcon.jsx";
import { Card, CardHeader, CardBody, Image, Skeleton } from "@nextui-org/react";

import MascotaModal from '../templates/MascotaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import VacunaModal from '../templates/VacunaModal.jsx';
import Header from '../moleculas/Header.jsx';

export function Mascotas() {
    const statusColorMap = {
        'En Adopcion': "success",
        Urgente: "danger",
        Reservado: "secondary",
        Adoptado: "warning",
        todos: "primary",
    };

    const statusOptions = [
        { name: "Todos", uid: "todos" },
        { name: "En Adopcion", uid: "En Adopcion" },
        { name: "Urgente", uid: "Urgente" },
        { name: "Reservado", uid: "Reservado" },
        { name: "Adoptado", uid: "Adoptado" },

    ];

    function Ejemplo({ mascotas }) {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set(["todos"]));
        const [rowsPerPage, setRowsPerPage] = useState(5);
        const [page, setPage] = useState(1);
        const [isLoaded, setIsLoaded] = useState(false);

        const statusFilter = useMemo(() => {
            return Array.from(selectedKeys).join(", ");
        }, [selectedKeys]);

        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = useMemo(() => {
            let filteredMascotas = mascotas;

            if (hasSearchFilter) {
                filteredMascotas = filteredMascotas.filter(mascota =>
                    mascota.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
                    mascota.sexo.toLowerCase().includes(filterValue.toLowerCase())
                );
            }

            if (statusFilter !== "todos") {
                filteredMascotas = filteredMascotas.filter(
                    (mascota) => mascota.estado === statusFilter
                );
            }

            return filteredMascotas;
        }, [mascotas, filterValue, statusFilter]);

        useEffect(() => {
            // Simulate fetching data with a delay
            setTimeout(() => {
                setIsLoaded(true);
            }, 1500);
        }, []);
        const onSearchChange = (e) => {
            setFilterValue(e.target.value);
        };

        const onClear = () => {
            setFilterValue('');
        };

        const renderCard = useCallback((mascota) => {
            return (
                <Card className="p-2 bg-gray-200" key={mascota.id_mascota}>
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                        <h4 className="font-bold text-2xl mb-1 text-gray-800">Nombre: {mascota.nombre}</h4>
                        <small className="text-gray-600 mb-2">Género: {mascota.sexo}</small>
                        <h4 className="font-semibold text-lg mb-2 text-gray-700">Raza: {mascota.fk_id_raza}</h4>
                        <Chip className="capitalize" color={statusColorMap[mascota.estado]} size="sm" variant="flat">
                            {mascota.estado}
                        </Chip>
                    </CardHeader>
                    <CardBody className="overflow-visible py-4">
                        <Skeleton isLoaded={isLoaded} className="rounded-lg">
                            <div className="relative w-full mb-4 overflow-hidden">
                                <Image
                                    alt="Card background"
                                    className="object-cover rounded-xl w-full h-full"
                                    src={mascota.img ? `${axiosClient.defaults.baseURL}/uploads/${mascota.img}` : "https://nextui.org/images/hero-card-complete.jpeg"}
                                    width='auto'
                                    height='auto'
                                />
                            </div>
                        </Skeleton>
                        <p className="text-sm text-gray-700 font-medium mb-4">{mascota.descripcion}</p>
                        <div className="mt-2 flex justify-start gap-2">
                            <Button color="default" variant="ghost" onPress={() => handleToggle('update', setMascotaId(mascota))}>
                                Actualizar
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            );
        }, [isLoaded]);

        return (
            <div className="flex flex-col items-center p-4 w-full">
                <div className="w-full sm:w-full lg:w-11/12 xl:w-11/12">
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={onClear}
                                onChange={onSearchChange}
                            />
                            <div className="z-0 flex gap-3">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                            className="capitalize"
                                            endContent={<ChevronDownIcon className="text-small text-slate-700" />}
                                        >
                                            {statusFilter}
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu
                                        aria-label="Single selection example"
                                        variant="flat"
                                        disallowEmptySelection
                                        selectionMode="single"
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={setSelectedKeys}
                                    >
                                        {statusOptions.map((status) => (
                                            <DropdownItem key={status.uid} className="capitalize w-55">
                                                {status.name}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown>
                                <Button color="warning" variant="bordered" className="z-1 text-orange-500" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                                    Registrar
                                </Button>
                                <Button color="default" variant="ghost" className="z-1 text-black" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggleVacuna('create')}>
                                    Registrar Vacuna
                                </Button>
                            </div>
                        </div>
                        <div className="z-0 grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredItems.map(renderCard)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [modalVacunaOpen, setModalVacunaOpen] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mascotas, setMascotas] = useState([]);
    const [mensaje, setMensaje] = useState('')
    const { idMascota, setMascotaId } = useContext(MascotasContext);

    useEffect(() => {
        peticionGet();
    }, []);

    const peticionGet = async () => {
        try {
            await axiosClient.get('/mascotas/listar').then((response) => {
                console.log(response.data);
                setMascotas(response.data);
            });
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const handleSubmit = async (formData, e) => {
        console.log('Datos enviados:', formData);
        e.preventDefault();

        try {
            if (mode === 'create') {
                await axiosClient.post('/mascotas/registrar', formData).then((response) => {
                    console.log('API Response:', response);
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center", // Posición centrada
                            icon: "success",
                            title: "Mascota registrada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet();
                    } else {
                        alert('Error en el registro');
                    }
                });
            } else if (mode === 'update') {
                await axiosClient.put(`/mascotas/actualizar/${idMascota.id_mascota}`, formData).then((response) => {
                    console.log('Datos enviados:', formData);
                    console.log('Respuesta del servidor:', response);
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center", // Posición centrada
                            icon: "success",
                            title: "Mascota actualizada con éxito",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        peticionGet();
                    } else {
                        alert('Error en la actualización');
                    }
                });
            }
        } catch (error) {
            console.log(error);
        }

        handleToggle();
    };

    const handleSubmitVacuna = async (formData, e) => {
        console.log('Datos enviados:', formData);
        e.preventDefault();

        try {
            await axiosClient.post('/vacunas/registrar', formData).then((response) => {
                console.log('API Response:', response);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center", // Posición centrada
                        icon: "success",
                        title: "Vacuna registrada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    peticionGet();
                } else {
                    alert('Error en el registro');
                }
            });
        } catch (error) {
            console.log(error);
        }

        handleToggleVacuna();
    };

    const handleToggle = (modalMode = 'create', data = null) => {
        setMode(modalMode);
        setInitialData(data);
        setModalOpen(!modalOpen);
    };

    const handleToggleAcciones = (modalMode = 'create', data = null) => {
        setMode(modalMode);
        setInitialData(data);
        setModalAcciones(!modalAcciones);
    };

    const handleToggleVacuna = (modalMode = 'create', data = null) => {
        setMode(modalMode);
        setInitialData(data);
        setModalVacunaOpen(!modalVacunaOpen);
    };
    return (
        <>
            <Header />
            <Ejemplo mascotas={mascotas} />
            <MascotaModal
                open={modalOpen}
                onClose={handleToggle}
                handleSubmit={handleSubmit}
                actionLabel={mode === 'create' ? 'Registrar' : 'Actualizar'}
                title={mode === 'create' ? 'Registrar Mascota' : 'Actualizar Mascota'}
                initialData={initialData}
                mode={mode}
            />
            <AccionesModal
                open={modalAcciones}
                onClose={handleToggleAcciones}
                handleSubmit={handleSubmit}
                actionLabel={mode === 'create' ? 'Registrar' : 'Actualizar'}
                title={mode === 'create' ? 'Registrar Mascota' : 'Actualizar Mascota'}
                initialData={initialData}
                mode={mode}
            />
            <VacunaModal
                open={modalVacunaOpen}
                onClose={handleToggleVacuna}
                handleSubmit={handleSubmitVacuna}
                actionLabel={'Registrar Vacuna'}
                title={'Registrar Vacuna'}
                initialData={initialData}
                mode={mode}
            />
        </>
    );
}

export default Mascotas;
