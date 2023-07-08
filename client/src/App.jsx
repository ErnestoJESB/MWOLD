import Header from "./components/header/Header";
import Cards from "./components/cards/cards";
import Conocenos from "./components/conocenos/conocenos";
import Carrousel from "./components/carrousel/carrousel"
import Login from "./components/header/Login";
import Register from "./components/header/register";
import Home from "./components/home/home";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegistrarIncidencia from "./components/incidencias/registrarincidencia";
import Comentario from "./components/incidencias/comentarios/comentario";
import ListarIncidencia from "./components/incidencias/listarincidencia";
import ListarComentario from "./components/incidencias/comentarios/listarcomentarios";


function App({ auth, role, id, condominioUser }) {
  const autenticacion = auth;
  const rol = role;
  const idUsuario = id;
  const idCondominio = condominioUser;
  return (
    <BrowserRouter>
      <Header auth={autenticacion} role={rol} />
      <Routes>
        <Route path="/" element={<div>
          <Cards />
          <Conocenos />
          <Carrousel />
        </div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {
          auth ?
            <Route path="/crearincidencia" element={<RegistrarIncidencia id={idUsuario} condominioUs={idCondominio} />} />
            :
            <Route path="/crearincidencia" element={<Login />} />
        }

        {
          auth ?
            <Route path="/comentarios/:idIncidencia/:idCondomino" element={<ListarComentario usuarioId={idUsuario} condominioId={idCondominio} rolUser={rol}/>} />
            :
            <Route path="/comentarios/:idIncidencia/:idCondomino" element={<Login />} />
        }

        {
          auth ?
            <Route path="/incidencias/:idUsuario" element={<ListarIncidencia id={idUsuario} condominioUs={idCondominio} />} />
            :
            <Route path="/incidencias/:idUsuario" element={<Login />} />
        }


      </Routes>
    </BrowserRouter>

  );
}

export default App;
