import React from 'react';
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import Header from '../moleculas/Header.jsx';
import NotificacionesMascotas from './NotificacionesMascotas.jsx';

const TabNotificaciones = () => {
    return (
        <div className='bg-[#EAEDF6] min-h-screen h-full'>
            <Header />
            <div className='bg-[#EAEDF6] flex flex-col items-center'>
                <div className='w-full max-w-[95%] p-6 flex-grow'>
                    <div className="flex flex-col gap-6 w-full h-full bg-[#EAEDF6]">
                        <Tabs aria-label="Options" variant="bordered">
                            <Tab key="mascotas" title="Mascotas">
                                <Card className="h-full">
                                    <CardBody>
                                        <NotificacionesMascotas />
                                    </CardBody>
                                </Card>
                            </Tab>
                            <Tab key="usuarios" title="Usuarios">
                                <Card className="h-full">
                                    <CardBody>
                                        {/* Lo suyo cana */}
                                    </CardBody>
                                </Card>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
};


export default TabNotificaciones
