import React, { useContext, useEffect, useState } from 'react';
import VacunaModal from '../templates/VacunaModal.jsx';
import AccionesModal from '../organismos/ModalAcciones.jsx';
import Swal from 'sweetalert2';
import FormVacunas from '../moleculas/FormVacuna.jsx'; // Ajusta la ruta según sea necesario
import { format } from 'date-fns';
import axiosClient from '../axiosClient.js';
import VacunasContext from '../../context/VacunasContext.jsx';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Dropdown,
    Pagination,
} from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { PlusIcon } from "./../nextUI/PlusIcon.jsx";
import { SearchIcon } from "./../nextUI/SearchIcon.jsx";
import { EditIcon } from "../nextUI/EditIcon";
import { DeleteIcon } from "../nextUI/DeleteIcon";
import Header from '../moleculas/Header.jsx';

function Vacunas() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAcciones, setModalAcciones] = useState(false);
    const [mode, setMode] = useState('create');
    const [initialData, setInitialData] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [vacunas, setVacunas] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const { idVacuna, setVacunaId } = useContext(VacunasContext);

    useEffect(() => {
        peticionGet();
        axiosClient.get('/mascotas/listar').then((response) => {
            setMascotas(response.data.filter(mascota => mascota.estado !== 'Adoptado'));
        });
    }, []);

    const peticionGet = async () => {
        try {
            const response = await axiosClient.get('/vacunas/listar');
            setVacunas(response.data.data);
        } catch (error) {
            console.log('Error en el servidor ' + error);
        }
    };

    const getMascotaNombre = (id) => {
        const mascota = mascotas.find(m => m.id_mascota === id);
        return mascota ? mascota.nombre : 'Desconocido';
    };

    const data = [
        { uid: 'id_vacuna', name: 'Id', sortable: true },
        { uid: 'fk_id_mascota', name: 'Mascota', sortable: true },
        { uid: 'fecha_vacuna', name: 'Fecha Vacuna', sortable: true },
        { uid: 'enfermedad', name: 'Enfermedad', sortable: true },
        { uid: 'estado', name: 'Estado', sortable: true },
        { uid: 'actions', name: "Acciones", sortable: true }
    ];

    const peticionDesactivar = async (id_vacuna) => {
        try {
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "¡Esto podría afectar a tus vacunas!",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "orange",
                cancelButtonColor: "#d33",
                confirmButtonText: "¡Sí, estoy seguro!"
            });

            if (result.isConfirmed) {
                const response = await axiosClient.delete(`/vacunas/eliminar/${id_vacuna}`);

                if (response.status === 200) {
                    Swal.fire({
                        title: "¡Eliminado!",
                        text: "Vacuna eliminada correctamente.",
                        icon: "success"
                    });
                    peticionGet();
                } else {
                    alert('Error al eliminar la vacuna');
                }
            }
        } catch (error) {
            alert('Error del servidor: ' + error);
        }
    };

    const handleSubmit = async (formData) => {
        try {
            if (mode === 'create') {
                const response = await axiosClient.post('/vacunas/registrar', formData);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Vacuna registrada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    peticionGet();
                } else {
                    Swal.fire('Error en el registro');
                }
            } else if (mode === 'update') {
                const response = await axiosClient.put(`/vacunas/actualizar/${initialData.id_vacuna}`, formData);
                if (response.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Vacuna actualizada con éxito",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    peticionGet();
                } else {
                    Swal.fire('Error al actualizar');
                }
            }
            setModalOpen(false);
        } catch (error) {
            Swal.fire('Error en el servidor: ' + error.message);
        }
    };
    
    

    const handleToggle = (mode, initialData) => {
        setInitialData(initialData);
        setModalOpen(true);
        setMode(mode);
    };

    const EjemploVacuna = () => {
        const [filterValue, setFilterValue] = useState("");
        const [selectedKeys, setSelectedKeys] = useState(new Set([]));
        const [rowsPerPage, setRowsPerPage] = useState(5);

        const [sortDescriptor, setSortDescriptor] = useState({
            column: "fecha_vacuna",
            direction: "ascending",
        });

        const [page, setPage] = useState(1);
        const hasSearchFilter = Boolean(filterValue);

        const filteredItems = React.useMemo(() => {
            let filteredVacunas = vacunas;
            if (hasSearchFilter) {
                filteredVacunas = filteredVacunas.filter(vacuna =>
                    String(vacuna.fecha_vacuna).toLowerCase().includes(filterValue.toLowerCase()) ||
                        vacuna.enfermedad.toLowerCase().includes(filterValue.toLowerCase())
                );
            }
            return filteredVacunas;
        }, [vacunas, filterValue]);

        const pages = Math.ceil(filteredItems.length / rowsPerPage);

        const items = React.useMemo(() => {
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            return filteredItems.slice(start, end);
        }, [page, filteredItems, rowsPerPage]);

        const sortedItems = React.useMemo(() => {
            return [...items].sort((a, b) => {
                const first = a[sortDescriptor.column];
                const second = b[sortDescriptor.column];
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === "descending" ? -cmp : cmp;
            });
        }, [sortDescriptor, items]);

        const renderCell = React.useCallback((vacuna, columnKey) => {
            const cellValue = vacuna[columnKey];

            switch (columnKey) {
                case "fk_id_mascota":
                    return getMascotaNombre(cellValue);

            
                case "fecha_vacuna":
                    // Formatear la fecha
                    return format(new Date(cellValue), 'dd/MM/yyyy');

                case "actions":
                    return (
                        <div className="relative flex justify-start items-center gap-2">
                            <Dropdown>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                        <EditIcon onClick={() => handleToggle('update', vacuna)} />
                                    </span>
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                        <DeleteIcon onClick={() => peticionDesactivar(vacuna.id_vacuna)} />
                                    </span>
                                </div>
                            </Dropdown>
                        </div>
                    );

                default:
                    return cellValue;
            }
        }, []);

        const onNextPage = React.useCallback(() => {
            if (page < pages) {
                setPage(page + 1);
            }
        }, [page, pages]);

        const onPreviousPage = React.useCallback(() => {
            if (page > 1) {
                setPage(page - 1);
            }
        }, [page]);

        const onRowsPerPageChange = React.useCallback((e) => {
            setRowsPerPage(Number(e.target.value));
            setPage(1);
        }, []);

        const onSearchChange = React.useCallback((value) => {
            if (value) {
                setFilterValue(value);
                setPage(1);
            } else {
                setFilterValue("");
            }
        }, []);

        const onClear = React.useCallback(() => {
            setFilterValue("");
            setPage(1);
        }, []);

        const topContent = React.useMemo(() => {
            return (
                <>
                    <div className="flex flex-col mt-3">
                        <div className="flex justify-between gap-3 items-end">
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%] bg-[#f4f4f5] rounded"
                                placeholder="Buscar..."
                                startContent={<SearchIcon />}
                                value={filterValue}
                                onClear={() => onClear()}
                                onValueChange={onSearchChange}
                            />
                            <div className="flex gap-3">
                                <Button color="warning" className="mr-30 text-white" style={{ position: 'relative' }} endContent={<PlusIcon />} onClick={() => handleToggle('create')}>
                                    Registrar
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-between items-center z-10 mr-30 mt-2">
                            <span className="text-white text-small">Total {vacunas.length} Resultados</span>
                            <label className="flex items-center text-white mr-30 text-small">
                                Columnas por página:
                                <select
                                    className="bg-transparent outline-none text-white text-small"
                                    onChange={onRowsPerPageChange}
                                >
                                    <option value="5">5</option>
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </>
            );
        }, [filterValue, onClear, onRowsPerPageChange, onSearchChange, vacunas.length]);

        const bottomContent = React.useMemo(() => {
            return (
                <Pagination
                    className="text-white"
                    total={pages}
                    page={page}
                    onPageChange={setPage}
                    showPages={true}
                    showPrevNextButtons
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                />
            );
        }, [pages, page, onNextPage, onPreviousPage]);

        return (
            <Table
                aria-label="Tabla"
                isHeaderSticky
                className="flex mr-16"
                topContent={topContent}
                bottomContent={bottomContent}
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={data}>
                    {column => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"No hay resultados registrados"} items={sortedItems}>
                    {item => (
                        <TableRow key={item.id_vacuna}>
                            {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        );
    };

    return (
        <>
            <Header />
            <div className='w-full max-w-[90%] ml-24 items-center p-10'>
                <EjemploVacuna />
                {modalOpen && (
                      <VacunaModal
    open={modalOpen}
    onClose={() => setModalOpen(false)}
    handleSubmit={handleSubmit}
    actionLabel={mode === 'create' ? 'Registrar Vacuna' : 'Actualizar Vacuna'}
    title={mode === 'create' ? 'Registrar Vacuna' : 'Actualizar Vacuna'}
    initialData={initialData} // Aquí se pasan los datos iniciales
    mode={mode}
/>
                )}
                {modalAcciones && (
                    <AccionesModal
                        open={modalAcciones}
                        onClose={() => setModalAcciones(false)}
                        idVacuna={idVacuna}
                        setIdVacuna={setVacunaId}
                    />
                )}
            </div>
        </>
    );
}

export default Vacunas;
