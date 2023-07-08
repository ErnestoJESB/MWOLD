import React, { useState, useEffect } from 'react';
import Incidencias from './incidencias';
import { useParams } from 'react-router-dom';

const ListarIncidencia = () => {
    const params = useParams();
    const  idCondomino  = params.idUsuario;
    console.log('este es el id del condomino ' + idCondomino);
    return (
        <div>
            <Incidencias condominoId={idCondomino} />
        </div>
        )    
}

export default ListarIncidencia;