import React, { useState } from 'react';
import axiosClient from '../axiosClient';
import Swal from 'sweetalert2';
import HeaderRecuperacionContra from '../moleculas/HeaderRecuperacionContra'; // Asegúrate de que la ruta sea correcta

function SolicitarRecuperacion() {
    const [correo, setCorreo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosClient.post('/usuarios/solicitar-reset-password', { correo });
            Swal.fire('Éxito', response.data.message, 'success');
        } catch (error) {
            Swal.fire('Error', error.response.data.message, 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Incorporamos el Header */}
            <HeaderRecuperacionContra title="Recuperar Contraseñaㅤ" />

            <div className="flex flex-1 items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Recuperar Contraseña</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Correo Electrónico:</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-warning-500"
                                placeholder="Ingresa tu correo electrónico"
                            />
                        </div>
                        <button
    type="submit"
    className="w-full bg-[#ec971f] text-white py-2 rounded-lg hover:bg-[#f0ad4e] transition duration-300"
>
    Enviar enlace
</button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default SolicitarRecuperacion;
