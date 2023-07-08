import React, {useEffect, useState} from "react";
import axios from "axios";


const Admin = ({userName, userId, idCondominio}) => {
    const [condominio, setCondominio] = useState([]);
    const [condominioName, setCondominioName] = useState('');
    const [condominos, setCondominos] = useState([]);


    useEffect(() => {
        axios.get(`http://localhost:3000/getCondominioUsuarios/${idCondominio}`)
            .then(res => {
                setCondominos(res.data);
            })
    }, [idCondominio]);


    return (
        <div>
            <h3>Admin</h3>
            <h3>Bienvenido {userName}</h3>
            <h3>{condominioName}</h3>
            <section>
                <div className="order">
                    <div className="col-md-7">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>n°</th>
                                    <th>Codómino</th>
                                    <th>Apellido</th>
                                    <th>Número Telefónico</th>
                                    <th>Correo</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    condominos.map((condominos, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{condominos.name}</td>
                                            <td>{condominos.lastname}</td>
                                            <td>{condominos.telefono}</td>
                                            <td>{condominos.email}</td>
                                            <td><a href={`http://localhost:5173/incidencias/${condominos.id}`} className="btn">Incidencias</a></td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section >
        </div>
    );
}

export default Admin;