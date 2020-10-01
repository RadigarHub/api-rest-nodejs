'use strict'

var validator = require('validator');
var bcrypt = require('bcryptjs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch(err) {
      return res.status(400).send({
        message: "Faltan datos por enviar."
      });  
    }

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
    try {
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    } catch(err) {
      return res.status(400).send({
        message: "Faltan datos por enviar."
      });  
    }

    if (!validate_email || !validate_password) {
      return res.status(400).send({
        message: "Los datos son incorrectos, envialos bien"
      });
    }

    // Buscar los usuarios que coincidan con el email
    User.findOne({email: params.email.toLowerCase()}, (err, user) => {

      if (err) {
        return res.status(500).send({
          message: "Error al intentar identificarse."
        });
      }

      if (!user) {
        return res.status(400).send({
          message: "El usuario no existe"
        });
      }

      // Si lo encuentra comprobar la contraseña (coincidencia de email y password / bcrypt)
      bcrypt.compare(params.password, user.password, (err, check) => {
        if (check) {
          // Comprobar si se está pidiendo el token de jwt
          if (params.gettoken) {
            // Generar el token jwt y devolverlo
            return res.status(200).send({
              token: jwt.createToken(user)
            });
          }

          // Limpiar el objeto user para que en el lado del cliente no se muestren algunas de sus propiedades
          user.password = undefined;

          // Devolver los datos
          return res.status(200).send({
            message: "success",
            user
          });
        } else {
          return res.status(400).send({
            message: "Las credenciales no son correctas."
          });
        }
      });

    });
  },

  update: function(req, res) {
    // Recoger los datos del usuario
    var params = req.body;

    // Validar los datos del usuario
    try {
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    } catch(err) {
      return res.status(400).send({
        message: "Faltan datos por enviar."
      });  
    }

    if (!validate_name || !validate_surname || !validate_email) {
      return res.status(400).send({
        message: "Los datos son incorrectos, envialos bien"
      });
    }

    // Eliminar propiedades innecesarias
    delete params.password;

    // Comprobar si el email es único
    User.findOne({email: params.email.toLowerCase()}, (err, user) => {

      if (err) {
        return res.status(500).send({
          message: "Error al intentar actualizar el usuario."
        });
      }

      if (user && user.email == params.email) {
        return res.status(400).send({
          message: "El email no puede ser actualizado porque ya está asignado a otro usuario."
        });
      }

      // Buscar y actualizar el usuario
      var userId = req.user.sub;
      User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {

        // Devolver una respuesta
        if (err) {
          return res.status(500).send({
            message: "Error al actualizar el usuario.",
            params
          });
        }

        if (!userUpdated) {
          return res.status(400).send({
            message: "No se ha podido actualizar el usuario.",
            params
          });
        }

        return res.status(200).send({
          status: "success",
          user: userUpdated
        });

      });
    });
  },

  uploadAvatar: function(req, res) {
    // Configurar el módulo multiparty (md) para permitir la subida de ficheros

    // Recoger el fichero de la petición

    // Conseguir el nombre y la extensión del archivo a subir

    // Comprobar la extensión del fichero a subir (sólo imágenes), si no es válida borrar el fichero

    // Obtener el id del usuario identificado

    // Buscar y actualizar los datos del usuario

    // Devolver respuesta
    return res.status(200).send({
      message: "Mensaje desde el método uploadAvatar",
    });
  }

};

module.exports = controller;