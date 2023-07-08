import React, { useState, useEffect } from 'react';
import Comentario from './comentario';
import { useParams } from 'react-router-dom';

const ListarComentario = ({ usuarioId, condominioId, rolUser }) => {
    const idCondominio = condominioId;
    const userRol = rolUser;

    console.log(userRol)

    if (userRol === "admin") {
        const params = useParams();
        const idUsuario = params.idCondomino;
        console.log('este es el id del condomino arriba ' + idUsuario)
        return (
            <div>
                <Comentario usuarioId={idUsuario} condominioId={idCondominio} />
            </div>
        )
    } else {
        const idUsuario = usuarioId;
        console.log('este es el id del usuario abajo ' + idUsuario)
        return (
            <div>
                <Comentario usuarioId={idUsuario} condominioId={idCondominio} />
            </div>
        )
    }
}

export default ListarComentario;