const path = require('path');
const multer = require('multer')


const controller = {};

controller.list = (req, res) => {
  const usuarioId = req.params.id; // Obtener el ID del cliente desde los parámetros de la URL
  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
    }
    conn.query('SELECT id, tipo, descripcion, fecha, lugar, image, estatus FROM incidencia WHERE idusuario = ? ORDER BY fecha DESC', [usuarioId], (err, incidencia) => {
      if (err) {
        res.json(err);
      }
      res.json(incidencia);
    });
  });
};
controller.listIncidencia = (req, res) => {
  const usuarioId = req.params.id; // Obtener el ID del cliente desde los parámetros de la URL
  const idIncidencia = req.params.idIncidencia; // Obtener el ID del cliente desde los parámetros de la URL
  console.log(usuarioId);
  console.log(idIncidencia);
  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
    }
    conn.query('SELECT id, tipo, descripcion, fecha, lugar, image, estatus FROM incidencia WHERE idusuario = ? AND id = ? ORDER BY fecha DESC', [usuarioId, idIncidencia], (err, incidencia) => {
      if (err) {
        res.json(err);
      }
      res.json(incidencia);
    });
  });
};


const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, '../incidencias'),
  filename: (req, file, cb) => {
    const originalname = file.originalname.replace(/[^\w.-]/g, ''); // Eliminar espacios en blanco
    cb(null, 'MWOLD-incidencia-' + originalname);
  }
});

const fileUpload = multer({
  storage: diskstorage
}).single('image');

const fs = require('fs');

controller.create = (req, res) => {
  fileUpload(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Error uploading image');
    }
    const data = req.body;

    req.getConnection((err, conn) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).send('Server error');
      }


      conn.query('INSERT INTO incidencia SET ?', data, (err, rows) => {
        if (err) {
          console.error('Error inserting image:', err);
          return res.status(500).send('Error inserting image');
        }
        console.log('Image inserted successfully');
      });
    });
  });
};


controller.upload = (req, res) => {
  fileUpload(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Error uploading image');
    }
    console.log(req.file);
    const filename = req.file.filename;
    const data = req.body;
    data.image = filename;
    console.log(data);
    req.getConnection((err, conn) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).send('Server error');
      }


      conn.query('INSERT INTO incidencia SET ?', data, (err, rows) => {
        if (err) {
          console.error('Error inserting image:', err);
          return res.status(500).send('Error inserting image');
        }
        console.log('Image inserted successfully');
      }); 
    });
  });
};

controller.comentarios = (req, res) => { 
  const idincidencia = req.params.id; // Obtener el ID del cliente desde los parámetros de la URL
  const sql = 'SELECT comentario, fecha FROM comentarios WHERE idincidencia = ?';
  req.getConnection((err, conn) => {
    if (err) {
      res.json(err);
    }
    conn.query(sql, [idincidencia], (err, comentario) => {
      if (err) {
        res.json(err);
      }
      res.json(comentario);
    });
  });
};

controller.createComentario = (req, res) => {
  const data = req.body;
  req.getConnection((err, conn) => {
    if (err) {
      console.error('Server error:', err);
      return res.status(500).send('Server error');
    }
    conn.query('INSERT INTO comentarios SET ?', data, (err, rows) => {
      if (err) {
        console.error('Error inserting image:', err);
        return res.status(500).send('Error inserting image');
      }
      console.log('Comment inserted successfully');
    });
  });
};




module.exports = controller;