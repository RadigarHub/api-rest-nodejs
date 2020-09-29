'use strict'

var controller = {

  probando: function(req, res) {
    return res.status(200).send({
      message: "Soy el método probando"
    });
  },

  testeando: function(req, res) {
    return res.status(200).send({
      message: "Soy el método testeando"
    });
  },

  save: function(req, res) {
    // Recoger los parámetros de la petición

    // Validar los datos

    // Crear objeto de usuario

    // Asignar valores al usuario

    // Comprobar si el usuario ya existe

    // Si no existe, cifrar la contraseña
    
    // Si no existe, guardarlo

    // Devolver respuesta

    return res.status(200).send({
      message: "Registro de usuarios"
    });
  }

};

module.exports = controller;