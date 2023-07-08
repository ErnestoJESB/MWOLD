import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import CrearComentario from "./crearcomentario";


const Comentario = ({ usuarioId, condominioId }) => {
    const params = useParams();
    const idIncidencia = params.idIncidencia;


    console.log('este es el id del usuario actual ' + usuarioId);
    console.log('este es el id del condominio ' + condominioId);
    console.log('este es el id de la incidencia ' + idIncidencia);

    const [comentario, setComentario] = useState([]);
    const [incidencias, setIncidencias] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:3000/comentarios/${idIncidencia}`)
            .then(res => {
                setComentario(res.data);
            })
    }, [idIncidencia]);

    useEffect(() => {
        axios.get(`http://localhost:3000/incidencias/${usuarioId}/${idIncidencia}`)
            .then(res => {
                setIncidencias(res.data);
                for (let i = 0; i < res.data.length; i++) {
                    let fecha1 = res.data[i].fecha;
                    let fecha = new Date(res.data[i].fecha);
                    if (fecha1 === null) {
                        res.data[i].fecha = "";
                    } else {

                        let dia = fecha.getDate();
                        let mes = fecha.getMonth() + 1;
                        let año = fecha.getFullYear();
                        let fechaFinal = `${dia}/${mes}/${año}`;
                        res.data[i].fecha = fechaFinal;
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }, [usuarioId, idIncidencia]);

    console.log(incidencias);
    return (
        <div>
            <section className="blogs" id="blogs">
                <div className="heading">
                    <span>Reporte</span>
                    <h3>de incidencia</h3>
                </div>

                <div className="box-container">
                    {incidencias.map((incidencia, index) => (
                        <div className="box" key={index}>
                            <div className="image">
                                <h3> <i className="fas fa-calendar"></i> {incidencia.fecha} </h3>
                                <img src={`http://localhost:3000/${incidencia.image}`} alt="" />
                            </div>
                            <div className="content">
                                <div className="tags">
                                    <a href="#"> <i className="fas fa-tag"></i> Tipo de incidencia / </a>
                                    <a href="#"> <i className="fas fa-tag"></i> {incidencia.tipo}</a>
                                </div>
                                <h3>Descripción</h3>
                                <p>{incidencia.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <CrearComentario idUsuario={usuarioId} idCondominio={condominioId} incidenciaId={idIncidencia}/>
            <section>
                <div className="order">
                    <div className="col-md-7">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>n°</th>
                                    <th>Comentario</th>
                                    <th>Fecha</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    comentario.map((comentario, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{comentario.comentario}</td>
                                            <td>{comentario.fecha}</td>
                                            <td><button className="btn btn-danger" onClick={() => eliminarComentario(comentario.id)}>Eliminar</button></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section >
        </div >

    );

}

export default Comentario;