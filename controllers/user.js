'use strict'

var validator = require('validator');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
const { param } = require('../routes/user');

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
    var params = req.body;

    // Validar los datos
    var validate_name = !validator.isEmpty(params.name);
    var validate_surname = !validator.isEmpty(params.surname);
    var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (validate_name && validate_surname && validate_email && validate_password) {
      // Crear objeto de usuario
      var user = new User();
      
      // Asignar valores al usuario
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.role = 'ROLE_USER';
      user.image = null;
      
      // Comprobar si el usuario ya existe
      User.findOne({email: user.email}, (err, issetUser) => {
        if (err) {
          return res.status(500).send({
            message: "Error al comprobar duplicidad de usuario."
          });
        }

        if (!issetUser) {
          // Si no existe, cifrar la contraseña
          bcrypt.hash(params.password, 10, (err, hash) => {
            user.password = hash;
            
            // Guardarlo en la BD
            user.save((err, userStored) => {
              if (err) {
                return res.status(500).send({
                  message: "Error al guardar el usuario."
                });
              }

              if (!userStored) {
                return res.status(400).send({
                  message: "El usuario no se ha guardado."
                });
              }

              // Devolver respuesta
              return res.status(200).send({
                status: 'success',
                user: userStored
              });
            });
          });
          
        } else {
          return res.status(400).send({
            message: "El usuario ya está registrado."
          });
        }
      });
      
    } else {
      return res.status(200).send({
        message: "Validación de los datos del usuario incorrecta, inténtelo de nuevo."
      });
    }
  },

  login: function(req, res) {
    // Recoger los parámetros de la petición
    var params = req.body;

    // Validar los datos
    var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    if (!validate_email || !validate_password) {
      return res.status(200).send({
        message: "Los datos son incorrectos, envialos bien"
      });
    }

    // Buscar los usuarios que coincidan con el email
    User.findOne({email: params.email.toLowerCase()}, (err, user) => {
          // Si lo encuentra comprobar la contraseña (coincidencia de email y password / bycript)
      
          // Si es correcto, generar token de jwt y devolverlo (más tarde)
      
          // Devolver los datos
          return res.status(200).send({
            message: "Método de login",
            user
          });
    });
  }

};

module.exports = controller;