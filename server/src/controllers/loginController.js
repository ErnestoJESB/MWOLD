const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



const controller = {};


controller.register = (req, res) => {
  const sql = 'INSERT INTO usuario (email, password, name, lastname, address, telefono, idcondominio, tipo_usuario) VALUES (?)';
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) return res.json({ Error: "Error al encriptar contraseña" });
    let tipo_usuario = "usuario";
    const values = [
      req.body.email,
      hash,
      req.body.name,
      req.body.lastname,
      req.body.address,
      req.body.phone,
      req.body.condominio,
      tipo_usuario
    ];
    req.getConnection((err, conn) => {
      if (err) return res.status(500).send('Error del servidor');
      conn.query(sql, [values], (err, result) => {
        if (err) {
          return res.json("Error al registrar usuario");
        }
        return res.json(result);
      });
    });
  })
};



controller.login = (req, res) => {
  const sql = 'SELECT * FROM usuario WHERE email = ?';
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error del servidor');
    conn.query(sql, [req.body.email], (err, data) => {
      if (err) return res.json("Obi wan kenobi has failed us");
      if (data.length > 0) {
        bcrypt.compare(req.body.password.toString(), data[0].password, (err, result) => {
          if (err) return res.json({ Error: "Error al comparar contraseñas" });
          if (result) {
            const tipo_usuario = data[0].tipo_usuario;
            const name = data[0].name;
            const id = data[0].id;
            const idcondominio = data[0].idcondominio;
            const token = jwt.sign({ tipo_usuario, name, id, idcondominio}, 'MWOLD', { expiresIn: '1h' })
            res.cookie('token', token)
            return res.json({ Login: true, tipo_usuario: data[0].tipo_usuario, userName: data[0].name, userId: data[0].id, idcondominio: data[0].idcondominio });
          }
          return res.json({ Login: false });
        });
      } else {
        return res.json({ Login: false });
      }
    });
  });

};


controller.user = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.json({ Error: "No hay token" });
  jwt.verify(token, 'MWOLD', (err, decoded) => {
    if (err) return res.json({ Error: "Token invalido" });
    req.tipo_usuario = decoded.tipo_usuario;
    req.userName = decoded.name;
    req.userId = decoded.id;
    req.idcondominio = decoded.idcondominio;
    next();
  });
  return res.json({ Status: "Success", tipo_usuario: req.tipo_usuario, userName: req.userName, userId: req.userId, idcondominio: req.idcondominio });
};

controller.logout = (req, res) => {
  res.clearCookie('token');
  return res.json({ Status: "Success" });
};


controller.condominios = (req, res) => {
  const sql = 'SELECT id, name FROM condominio';
  req.getConnection((err, conn) => {
    if (err) return res.status(500).send('Error del servidor');
    conn.query(sql, (err, result) => {
      if (err) return res.json("Error al obtener condominios");
      return res.json(result);
    });
  });
};


module.exports = controller;