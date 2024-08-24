import React, { useRef, useEffect, useState, useContext } from 'react';
import { ModalFooter, Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Button } from "@nextui-org/button";
import UsuarioContext from '../../context/UsuariosContext.jsx';
import { EyeFilledIcon } from "../nextUI/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../nextUI/EyeSlashFilledIcon";
import { CameraIcon } from '../nextUI/CameraIcon.jsx';
import axiosClient from '../axiosClient.js';

const FormUsuarios = ({ mode, handleSubmit, onClose, actionLabel }) => {
    const [rol, setRol] = useState([]);
    const [tipo_documento, setTipoDocumento] = useState([]);

    // useState para gestionar el estado de los campos del formulario.
    const [tipoDocumentoOp, setTipoDocumentoOp] = useState('');
    const [rolOp, setRolOp] = useState('');
    const [documento_identidad, setDocumentoIdentidad] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [direccion, setDireccion] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [password, setPassword] = useState('');
    const [passwordDisplay, setPasswordDisplay] = useState('****'); // Para mostrar solo 4 asteriscos
    const [foto, setFoto] = useState(null);
    const [fotoUrl, setFotoUrl] = useState('');
    const fileInputRef = useRef(null);

    const { idUsuario } = useContext(UsuarioContext);

    useEffect(() => {
        const enumDataTipoDocumento = [
            { key: "tarjeta", label: "Tarjeta" },
            { key: "cedula", label: "Cédula" },
            { key: "tarjeta de extranjeria", label: "Tarjeta de extranjería" },
        ];
        setTipoDocumento(enumDataTipoDocumento);
    }, []);

    useEffect(() => {
        const enumDataRol = [
            { key: "superusuario", label: "Super usuario" },
            { key: "administrador", label: "Administrador" },
            { key: "usuario", label: "Usuario" },
        ];
        setRol(enumDataRol);
    }, []);

    useEffect(() => {
        if (mode === 'update' && idUsuario) {
            setTipoDocumentoOp(idUsuario.tipo_documento || '');
            setDocumentoIdentidad(idUsuario.documento_identidad || '');
            setNombre(idUsuario.nombre || '');
            setApellido(idUsuario.apellido || '');
            setDireccion(idUsuario.direccion || '');
            setCorreo(idUsuario.correo || '');
            setTelefono(idUsuario.telefono || '');
            setPassword(''); // La contraseña en sí no se muestra
            setPasswordDisplay('****'); // Mostrar solo 4 asteriscos
            setRolOp(idUsuario.rol || '');
            setFotoUrl(idUsuario.img ? `${axiosClient.defaults.baseURL}/uploads/${idUsuario.img}` : '');
        }
    }, [mode, idUsuario]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('tipo_documento', tipoDocumentoOp);
            formData.append('documento_identidad', documento_identidad);
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('direccion', direccion);
            formData.append('correo', correo);
            formData.append('telefono', telefono);
            formData.append('password', password); // Enviar la contraseña real
            formData.append('rol', rolOp);

            if (foto) {
                formData.append('img', foto);
            }

            handleSubmit(formData, e);
        } catch (error) {
            alert('Hay un error en el sistema ' + error);
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value); // Actualizar la contraseña real
        setPasswordDisplay(e.target.value); // Actualizar lo que se muestra en el campo
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFoto(file);
        if (file) {
            setFotoUrl(URL.createObjectURL(file));
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <form method='post' onSubmit={handleFormSubmit}>
            <div className='flex flex-col items-center mb-4'>
                <Avatar
                    showFallback
                    className="w-24 h-24 cursor-pointer mb-4"
                    onClick={handleClick}
                    src={fotoUrl}
                />
                <input
                    type="file"
                    accept="image/*"
                    name="img"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                />
            </div>

            <div className='flex flex-wrap justify-between'>
                <div className='flex flex-col w-full md:w-1/2 p-2'>
                    {/* Campo Tipo de Documento */}
                    <div className="py-2">
                        <select
                            /* label="Tipo de documento" */
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="tipo_documento"
                            value={tipoDocumentoOp}
                            onChange={(e) => setTipoDocumentoOp(e.target.value)}
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Tipo de documento
                            </option>
                            {tipo_documento.map((tipo) => (
                                <option key={tipo.key} value={tipo.key}>
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className='py-2'>
                        <Input
                            type="number"
                            color='warning'
                            variant="bordered"
                            label="Documento de identidad"
                            className="w-full"
                            id='documento_identidad'
                            name="documento_identidad"
                            value={documento_identidad}
                            onChange={(e) => setDocumentoIdentidad(e.target.value)}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Nombre"
                            className="w-full"
                            id='nombre'
                            name="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Apellido"
                            className="w-full"
                            id='apellido'
                            name="apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            type="text"
                            color='warning'
                            variant="bordered"
                            label="Dirección"
                            className="w-full"
                            id='direccion'
                            name="direccion"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className='flex flex-col w-full md:w-1/2 p-2'>
                    <div className='py-2'>
                        <Input
                            type="email"
                            color='warning'
                            variant="bordered"
                            label="Correo Electrónico"
                            className="w-full"
                            id='correo'
                            name="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            label="Contraseña"
                            name="password"
                            color='warning'
                            variant="bordered"
                            id="password"
                            endContent={
                                <button type="button" onClick={toggleVisibility}>
                                    {isVisible ? (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none mb-2" />
                                    ) : (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={isVisible ? "text" : "password"}
                            className="w-full"
                            value={passwordDisplay}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>
                    <div className='py-2'>
                        <Input
                            color='warning'
                            variant="bordered"
                            type="tel"
                            label="Teléfono"
                            className="w-full"
                            id='telefono'
                            name="telefono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                    <div className='py-2'>
                        <select
                            label="Rol"
                            className="pl-2 pr-4 py-2 w-80 h-14 text-sm border-2 rounded-xl border-gray-200 hover:border-gray-400 shadow-sm text-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                            name="rol"
                            value={rolOp}
                            onChange={(e) => setRolOp(e.target.value)}
                        >
                            <option value="" hidden className="text-gray-600">
                                Seleccionar Rol
                            </option>
                            {rol.map((rol) => (
                                <option key={rol.key} value={rol.key}>
                                    {rol.label}
                                </option>
                            ))}
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

export default FormUsuarios;