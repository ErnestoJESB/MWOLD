import React from "react";

import Incidencias from "../../incidencias/incidencias";

const Condomino = ({ userName, userId }) => {
    const id = userId;

    return (
        <section className="order" id="order">
            <div className="heading">
                <span>Bienvenido</span>
                <h3>{userName}</h3>
            </div>
            <section className="category">
                <a href="http://localhost:5173/crearincidencia" className="box">
                    <img src="img/condominio-1.jpg" alt="" />
                    <h3>Crear incidencia</h3>
                </a>
                <a href="#" className="box">
                    <img src="img/condominio-1.jpg" alt="" />
                    <h3>Avisos</h3>
                </a>
            </section>
            <Incidencias condominoId={id} />
        </section>
    );
}

export default Condomino;