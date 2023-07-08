const express = require('express')
const fs = require('fs');
const path = require('path');
const multer = require('multer')


const controller = {};

controller.list = (req, res) => {
  import('node-fetch')
    .then(({ default: fetch }) => {
      fetch('http://localhost:3000/getCondominio')
        .then(response => response.json())
        .then(condominios => {
          res.render('condominios', {
            data: condominios
          });
        })
        .catch(error => {
          res.json(error);
        });
    })
    .catch(error => {
      res.json(error);
    });
};

controller.get = (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('server error');

    const query = 'SELECT * FROM condominio ORDER BY name ASC';
    conn.query(query, (err, rows) => {
      if (err) return res.status(500).send('server error');

      const imageList = [];

      rows.forEach((img) => {
        const imageName = img.id + '-condominio.png';
        const imagePath = path.join(__dirname, '../condominios/', imageName);

        if (img.data_image) {
          fs.writeFileSync(imagePath, img.data_image);

          const image = {
            id: img.id,
            name: img.name,
            address: img.address,
            description: img.description,
            imageName: imageName,
          };

          imageList.push(image);
        }
      });

      res.json(imageList);
    });
  });
};

const diskstorage = multer.diskStorage({
  destination: path.join(__dirname, '../condominiosGuardar'),
  filename: (req, file, cb) => {
    cb(null, 'MWOLD' + '-condominios-' + file.originalname);
  }
});

const fileUpload = multer({
  storage: diskstorage
}).single('image');

controller.save = (req, res) => {
  fileUpload(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Error uploading image');
    }
    console.log(req.file);
    const data = req.body;

    req.getConnection((err, conn) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).send('Server error');
      }

      const type = req.file.mimetype;
      const name_image = req.file.originalname;
      const data_image = fs.readFileSync(path.join(__dirname, '../condominiosGuardar/' + req.file.filename));

      data.type = type;
      data.name_image = name_image;
      data.data_image = data_image;

      conn.query('INSERT INTO condominio SET ?', data, (err, rows) => {
        if (err) {
          console.error('Error inserting image:', err);
          return res.status(500).send('Error inserting image');
        }
        /*res.send('Condominio guardado');*/
        res.redirect('/condominio');
      });
    });
  });
};

controller.delete = (req, res) => {
  const { id } = req.params;

  req.getConnection((err, conn) => {
    conn.query('SELECT * FROM condominio WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error('Error retrieving condominio:', err);
        return res.status(500).send('Error retrieving condominio');
      }

      if (rows.length === 0) {
        return res.status(404).send('Condominio not found');
      }

      const condominio = rows[0];
      const imagePath = path.join(__dirname, '../condominiosGuardar/','MWOLD' + '-condominios-' + condominio.name_image);
      const imagePathId = path.join(__dirname, '../condominios/', condominio.id + '-condominio.png');

      fs.unlink(imagePathId, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          // No detener el proceso si no se pudo eliminar el archivo
        }
      });

      // Eliminar el archivo de imagen
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Error deleting image file:', err);
          // No detener el proceso si no se pudo eliminar el archivo
        }

        // Eliminar la entrada del condominio de la base de datos
        conn.query('DELETE FROM condominio WHERE id = ?', [id], (err, rows) => {
          if (err) {
            console.error('Error deleting condominio:', err);
            return res.status(500).send('Error deleting condominio');
          }

          res.redirect('/condominio');
        });
      });
    });
  });
};

controller.edit = (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la solicitud

  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error del servidor');

    const query = 'SELECT * FROM condominio WHERE id = ?'; // Filtrando por el ID proporcionado
    conn.query(query, [id], (err, rows) => {
      if (err) return res.status(500).send('Error del servidor');

      const imageList = [];

      rows.forEach((img) => {
        const imageName = img.id + '-condominio.png';
        const imagePath = path.join(__dirname, '../condominios/', imageName);

        if (img.data_image) {
          fs.writeFileSync(imagePath, img.data_image);

          const image = {
            id: img.id,
            name: img.name,
            address: img.address,
            description: img.description,
            imageName: imageName,
          };

          imageList.push(image);
        }
      });
      /* res.json(imageList); */
      res.render('condominios_edit', { imageList: imageList[0] });

    });
  });
};

controller.update = (req, res) => {
  const { id } = req.params;
  const updatedCondominios = req.body;

  fileUpload(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Error uploading image');
    }

    const imageFile = req.file;
    console.log(imageFile);

    req.getConnection((err, conn) => {
      if (err) {
        console.error('Server error:', err);
        return res.status(500).send('Server error');
      }

      if (imageFile) {
        // Si se ha cargado una nueva imagen, actualizar los datos de la imagen
        const type = imageFile.mimetype;
        const name_image = imageFile.originalname;
        const data_image = fs.readFileSync(path.join(__dirname, '../condominiosGuardar/' + imageFile.filename ));

        updatedCondominios.type = type;
        updatedCondominios.name_image = name_image;
        updatedCondominios.data_image = data_image;
        
      }      
      conn.query('SELECT * FROM condominio WHERE id = ?', [id], (err, rows) => {
        if (err) {
          console.error('Error retrieving condominio:', err);
          return res.status(500).send('Error retrieving condominio');
        }
  
        if (rows.length === 0) {
          return res.status(404).send('Condominio not found');
        }
        
        const condominio = rows[0];
        const imagePath = path.join(__dirname, '../condominiosGuardar/','MWOLD' + '-condominios-' + condominio.name_image);

        // Eliminar el archivo de imagen
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error('Error deleting image file:', err);
            // No detener el proceso si no se pudo eliminar el archivo
          }
        });
      });

        const name = req.body.name;
        const address = req.body.address;
        const description = req.body.description;

        updatedCondominios.name = name;
        updatedCondominios.address = address;
        updatedCondominios.description = description;
        console.log(updatedCondominios);

      conn.query('UPDATE condominio SET ? WHERE id = ?', [updatedCondominios, id], (err, rows) => {
        if (err) {
          console.error('Error updating condominio:', err);
          return res.status(500).send('Error updating condominio');
        }
        res.redirect('/condominio');
      });
    });
  });
};

controller.getUsuarios = (req, res) => {
  const { id } = req.params;
  req.getConnection((err, conn) => {
    conn.query('SELECT id, name, lastname, telefono, email FROM usuario WHERE idcondominio = ? AND tipo_usuario = "usuario"', [id], (err, usuarios) => {
      if (err) {
        res.json(err);
      }
      return res.json(usuarios);
    })
  })
};
  

module.exports = controller;

/* controller.list = (req, res) => {
      req.getConnection((err, conn) => {
        conn.query('SELECT * FROM condominio', (err, condominios) => {
          if (err) {
            res.json(err);
          }
          res.render('condominios', {
            data: condominios
          })
        })
      })
    }; */


/* controller.save = (req, res) => {
    const data = req.body;

    req.getConnection((err, conn) =>{
        conn.query('INSERT INTO customer set ?', [data], (err, customer =>{
            res.redirect('/')
        }))
    })
} */

/* controller.save = (req, res) => {

  const data = req.body;
  const image = req.files && req.files.image;

  if (image) {
    const uploadDir = path.join(__dirname, 'condominios_images');
    // Verificar si el directorio existe
    if (!fs.existsSync(uploadDir)) {
      // Crear el directorio si no existe
      fs.mkdirSync(uploadDir);
    }
    const imageName = Date.now() + '_condominio_' + image.name; // Nombre único para la imagen
    const imagePath = path.join(uploadDir, imageName); // Ruta completa de la imagen
    data.image_name = imageName;


    image.mv(imagePath, (err) => {
      if (err) {
        console.error('Error uploading image:', err);
      } else {
        // Aquí puedes utilizar el `imagePath` para guardar la ruta de la imagen en la base de datos
        data.image_path = imagePath;

        req.getConnection((err, conn) => {
            conn.query('INSERT INTO customer SET ?', data, (err, customer) => {
              if (err) {
                console.error('Error inserting customer:', err);
              } else {
                res.redirect('/');
              }
            });
          });
      }
    });
  } else {
    // Resto del código para insertar los datos en la base de datos y redireccionar
    req.getConnection((err, conn) => {
        conn.query('INSERT INTO customer SET ?', data, (err, customer) => {
          if (err) {
            console.error('Error inserting customer:', err);
          } else {
            res.redirect('/');
          }
        });
      });
  }
};
 */


/* Guarda la imagen y datos */


/* Fin guardar img */



/* controller.edit = (req, res) => {
  const { id } = req.params;

 req.getConnection((err, conn) => {
    conn.query('SELECT * FROM condominio WHERE id = ?', [id], (err, condominio) => {
      res.render('condominios_edit', {
        data: condominio[0]
      })
    })
  })
  
} */
