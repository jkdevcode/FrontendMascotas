import React, { useEffect, useState, useContext, useRef } from 'react';
import { ModalFooter, Input, Textarea, Avatar, AvatarGroup } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import MascotasContext from '../../context/MascotasContext.jsx';
import axiosClient from '../axiosClient.js';
/* import { DatePicker } from "@nextui-org/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date"; */

const FormMascotas = ({ mode, handleSubmit, onClose, actionLabel }) => {
    // Estados para manejar los datos del formulario
    const [categoria, setCategoria] = useState([]);
    const [raza, setRaza] = useState([]);
    const [departamento, setDepartamento] = useState([]);
    const [municipio, setMunicipio] = useState([]);
    // Estados para manejar los datos de la mascota
    const [nombre, setNombre] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [estado, setEstado] = useState('En Adopcion');
    const [descripcion, setDescripcion] = useState('');
    const [esterilizacion, setEsterilizacion] = useState('');
    const [tamano, setTamano] = useState('');
    const [peso, setPeso] = useState('');
    const [fk_id_categoria, setFkIdCategoria] = useState('');
    const [fk_id_raza, setFkIdRaza] = useState('');
    const [fk_id_departamento, setFkIdDepartamento] = useState('');
    const [fk_id_municipio, setFkIdMunicipio] = useState('');
    const [sexo, setSexo] = useState('');
    const [fotos, setFotos] = useState([]); // Para manejar imágenes existentes
    const [nuevasFotos, setNuevasFotos] = useState([]); // Para manejar nuevas fotos
    const fileInputRef = useRef(null);
    const { idMascota } = useContext(MascotasContext);

    // useEffect para cargar las listas de categorías, razas, departamentos y municipios
    useEffect(() => {
        axiosClient.get('/categorias/listar').then((response) => setCategoria(response.data));
        axiosClient.get('/razas/listar').then((response) => setRaza(response.data));
        axiosClient.get('/departamentos/listar').then((response) => setDepartamento(response.data));
        axiosClient.get('/municipios/listar').then((response) => setMunicipio(response.data));
    }, []);

    // useEffect para manejar la lógica de actualización o creación de una mascota
    useEffect(() => {
        if (mode === 'update' && idMascota) {
            setNombre(idMascota.nombre_mascota || '');
            setFechaNacimiento(idMascota.fecha_nacimiento ? new Date(idMascota.fecha_nacimiento).toISOString().split('T')[0] : '');
            setEstado(idMascota.estado || 'En Adopcion');
            setDescripcion(idMascota.descripcion || '');
            setEsterilizacion(idMascota.esterilizado || '');
            setTamano(idMascota.tamano || '');
            setPeso(idMascota.peso || '');
            setFkIdCategoria(idMascota.fk_id_categoria || '');
            setFkIdRaza(idMascota.fk_id_raza || '');
            setFkIdDepartamento(idMascota.fk_id_departamento || '');
            setFkIdMunicipio(idMascota.fk_id_municipio || '');
            setSexo(idMascota.sexo || '');

            // Convertir cadena de imágenes a array de URLs
            const imagenesArray = idMascota.imagenes ? idMascota.imagenes.split(',').map(imagen => `http://localhost:8366/uploads/${imagen}`) : [];
            console.log("Imágenes existentes:", imagenesArray);
            setFotos(imagenesArray);
        }
    }, [mode, idMascota]);

    // Manejar el envío del formulario
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem('user'));
        const fk_id_usuario = user ? user.id_usuario : null;
        if (!fk_id_usuario) {
            console.error('Usuario no encontrado en localStorage');
            return;
        }
        const formData = new FormData();
        formData.append('nombre_mascota', nombre);
        formData.append('fecha_nacimiento', fechaNacimiento);
        formData.append('estado', estado);
        formData.append('descripcion', descripcion);
        formData.append('esterilizado', esterilizacion);
        formData.append('tamano', tamano);
        formData.append('peso', peso);
        formData.append('fk_id_categoria', fk_id_categoria);
        formData.append('fk_id_raza', fk_id_raza);
        formData.append('fk_id_departamento', fk_id_departamento);
        formData.append('fk_id_municipio', fk_id_municipio);
        formData.append('sexo', sexo);
        formData.append('fk_id_usuario', fk_id_usuario);

        // Agregar las nuevas fotos a FormData
        nuevasFotos.forEach((imagen) => {
            formData.append('imagenes', imagen);
            console.log(`Agregando nueva imagen al FormData: ${imagen}`);
        });

        // Enviar los datos al método handleSubmit
        handleSubmit(formData, e);
    };

    // Manejar cambios en la selección de imágenes
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Nuevas fotos seleccionadas:", files);
        setNuevasFotos((prevFotos) => [...prevFotos, ...files]);
    };

    // Manejar clic en el selector de archivos
    const handleClick = () => {
        console.log("Abriendo selector de archivos...");
        fileInputRef.current.click();
    };

    return (
        <form method='post' onSubmit={handleFormSubmit} encType="multipart/form-data">
            <div className='flex flex-row items-center justify-center'>
                <AvatarGroup isBordered max={4} size={20} className='gap-1'>
                    {fotos.map((imagen, index) => (
                        <Avatar
                            key={`existing-${index}`}
                            showFallback
                            size={80}
                            className="w-24 h-24 cursor-pointer mb-4"
                            onClick={handleClick}
                            src={imagen}
                            fallback={
                                <CameraIcon className="animate-pulse w-12 h-12 text-default-500" fill="currentColor" size={20} />
                            }
                            onError={() => console.error(`Error al cargar la imagen existente: ${imagen}`)}
                        />
                    ))}
                    {nuevasFotos.map((imagen, index) => (
                        <Avatar
                            key={`new-${index}`}
                            showFallback
                            size={80}
                            className="w-24 h-24 cursor-pointer mb-4"
                            onClick={handleClick}
                            src={URL.createObjectURL(imagen)}
                            fallback={
                                <CameraIcon className="animate-pulse w-12 h-12 text-default-500" fill="currentColor" size={20} />
                            }
                            onError={() => console.error(`Error al cargar la nueva imagen: ${URL.createObjectURL(imagen)}`)}
                        />
                    ))}
                    {[...Array(4 - fotos.length - nuevasFotos.length)].map((_, index) => (
                        <Avatar
                            size="xl"
                            key={`empty-${index}`}
                            showFallback
                            className="w-24 h-24 cursor-pointer mb-4"
                            onClick={handleClick}
                            fallback={
                                <CameraIcon className="animate-pulse w-8 h-8 text-default-500" fill="currentColor" size={20} />
                            }
                        />
                    ))}
                </AvatarGroup>
                <input
                    type="file"
                    name="imagenes"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                    multiple
                />
            </div>
            {/*  */}
            <div className='flex justify-center'>
                <div className='flex flex-col mr-4'>
                    <div className='py-2'>
                        <Input
                            type="text"
                            label="Nombre de la mascota"
                            className="w-80"
                            color='warning'
                            variant="bordered"
                            id='nombre'
                            name="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className="py-2">
                        <input
                            type="date"
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            id='fecha_nacimiento'
                            name="fecha_nacimiento"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            required
                        />
                        {/*  <DatePicker
                            label="Fecha Nacimiento"
                            className="w-80"
                            color='warning'
                            variant="bordered"
                            minValue={today(getLocalTimeZone())}
                            value={fechaNacimiento}
                            onChange={(date) => setFechaNacimiento(date)}
                            required
                        /> */}
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="tamano"
                            value={tamano}
                            onChange={(e) => setTamano(e.target.value)}
                            required
                        >
                            <option value="" hidden>
                                Tamaño
                            </option>
                            <option value="grande">Grande</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="mediano">Mediano</option>
                            <option value="pequeño">Pequeño</option>
                        </select>
                    </div>
                    <div className='py-2'>
                        <Input
                            type="number"
                            label="Peso (kg)"
                            className="w-80"
                            color='warning'
                            variant="bordered"
                            id='peso'
                            name="peso"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            required
                            min="0"
                        />
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="fk_id_categoria"
                            value={fk_id_categoria}
                            onChange={(e) => setFkIdCategoria(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Categoría
                            </option>
                            {categoria.map(cate => (
                                <option key={cate.id_categoria} value={cate.id_categoria}>
                                    {cate.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="fk_id_raza"
                            value={fk_id_raza}
                            onChange={(e) => setFkIdRaza(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Raza
                            </option>
                            {raza.map(raz => (
                                <option key={raz.id_raza} value={raz.id_raza}>
                                    {raz.nombre_raza}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="fk_id_departamento"
                            value={fk_id_departamento}
                            onChange={(e) => setFkIdDepartamento(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Departamento
                            </option>
                            {departamento.map(depar => (
                                <option key={depar.id_departamento} value={depar.id_departamento}>
                                    {depar.nombre_departamento}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='flex flex-col ml-4'>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="fk_id_municipio"
                            value={fk_id_municipio}
                            onChange={(e) => setFkIdMunicipio(e.target.value)}
                            required
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Municipio
                            </option>
                            {municipio.map(muni => (
                                <option key={muni.id_municipio} value={muni.id_municipio}>
                                    {muni.nombre_municipio}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="sexo"
                            value={sexo}
                            onChange={(e) => setSexo(e.target.value)}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar Sexo
                            </option>
                            <option value="Macho">Macho</option>
                            <option value="Hembra">Hembra</option>
                        </select>
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="esterilizado"
                            value={esterilizacion}
                            onChange={(e) => setEsterilizacion(e.target.value)}
                            required
                        >
                            <option value="" hidden>
                                ¿Está esterilizado?
                            </option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                    <div className='py-2'>
                        <Textarea
                            label="Descripción de la mascota"
                            className="w-80"
                            color='warning'
                            variant="bordered"
                            id='descripcion'
                            name="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <select
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="estado"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            required
                        >
                            <option value="" hidden>
                                Seleccionar Estado
                            </option>
                            <option value="En Adopcion">En Adopción</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Urgente">Urgente</option>
                            <option value="Adoptado">Adoptado</option>
                        </select>
                    </div>
                </div>
            </div>
            <ModalFooter>
                <Button color='danger' variant='flat' onClick={onClose} >
                    Cerrar
                </Button>
                <Button
                    type='submit' color="warning" className='text-white'
                >
                    {actionLabel}
                </Button>
            </ModalFooter>
        </form>
    );
};
export default FormMascotas;