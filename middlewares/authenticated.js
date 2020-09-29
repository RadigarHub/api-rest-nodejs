'use strict'

var moment = require('moment');
var jwt = require('jwt-simple');
const key = 'clave-secreta-para-generar-el-token-9999';

exports.authenticate = function(req, res, next) {

  // Comprobar si llega autorización
  if (!req.headers.authorization) {
    return res.status(400).send({
      message: "La petición no tiene la cabecera de autenticación."
    });
  }

  // Limpiar el token y quitar comillas
  var token = req.headers.authorization.replace(/['"]+/g, '');

  // Decodificar token
  try {
    var payload = jwt.decode(token, key);

    // Comprobar si el token ha expirado
    if (payload.exp <= moment().unix()) {
      return res.status(400).send({
        message: "El token ha expirado."
      });  
    }

  } catch(ex) {
    return res.status(400).send({
      message: "El token no es válido."
    });
  }

  // Adjuntar usuario identificado a request
  req.user = payload;

  // Pasar a la acción
  next();

};