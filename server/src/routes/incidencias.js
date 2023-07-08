const express = require('express');
const router  = express.Router();
const incidenciasController = require('../controllers/incidenciasController');

router.get('/incidencias/:id', incidenciasController.list);
router.get('/incidencias/:id/:idIncidencia', incidenciasController.listIncidencia);
router.post('/incidencias', incidenciasController.create);
router.post('/upload', incidenciasController.upload);
router.get('/comentarios/:id', incidenciasController.comentarios);
router.post('/comentarios', incidenciasController.createComentario);


module.exports = router;
