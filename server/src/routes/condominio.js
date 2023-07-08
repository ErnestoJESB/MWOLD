const express = require('express');
const router  = express.Router();
const path = require('path');

const condominioController = require('../controllers/condominiosController');


router.get('/condominio', condominioController.list)
router.get('/getCondominio', condominioController.get)
router.post('/addCondominio', condominioController.save)
router.get('/deleteCondominio/:id', condominioController.delete)
router.get('/updateCondominio/:id', condominioController.edit)
router.post('/updateCondominio/:id', condominioController.update)
router.get('/getCondominioUsuarios/:id', condominioController.getUsuarios)
/* router.get('/getCondominioInfo/:id', condominioController.getInfo)
 */
module.exports = router;
