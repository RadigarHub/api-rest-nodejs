'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

  add: function(req, res) {
    // Recoger el id del topic de la url
    var topicId = req.params.topicId;

    // Find por id del topic
    Topic.findById(topicId).exec((err, topic) => {
      
      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error en la petición"
        });
      }

      if (!topic) {
        return res.status(400).send({
          status: "error",
          message: "No existe el tema"
        });
      }

      // Comprobar objeto content y validar los datos
      if (req.body.content) {
        try {
          var validate_content = !validator.isEmpty(req.body.content);
        } catch(err) {
          return res.status(400).send({
            message: "No has comentando nada"
          });
        }

        if (validate_content) {

          // En la propiedad comments del objeto resultante hacer un push con los datos del nuevo comentario
          var comment = {
            user: req.user.sub,
            content: req.body.content
          };
          topic.comments.push(comment);
      
          // Guardar el topic
          topic.save((err) => {

            // Devolver una respuesta
            if (err) {
              return res.status(500).send({
                status: "error",
                message: "Error al guardar el comentario"
              });
            }

            return res.status(200).send({
              status: "success",
              topic
            });
          });

        } else {
          return res.status(400).send({
            message: "Los datos no son válidos"
          });
        }
      }
    });
  },

  update: function(req, res) {
    // Conseguir el id del comentario por la url
    var commentId = req.params.commentId;

    // Recoger datos del body
    var params = req.body;

    // Validar los datos
    if (req.body.content) {
      try {
        var validate_content = !validator.isEmpty(req.body.content);
      } catch(err) {
        return res.status(400).send({
          message: "No has comentando nada"
        });
      }

      if (validate_content) {
        // Find and Update de subdocumento (comentario)
        // El $set es una propiedad usada para actualizar subdocumentos
        // El $ en comments.$.content hace referencia al comentario seleccionado anteriormente en comments._id: commentId
        Topic.findOneAndUpdate(
          { "comments._id": commentId },
          {
            "$set": {
              "comments.$.content": params.content
            }
          },
          {new: true},
          (err, topicUpdated) => {

            // Devolver los datos
            if (err) {
              return res.status(500).send({
                status: "error",
                message: "Error en la petición"
              });
            }
      
            if (!topicUpdated) {
              return res.status(400).send({
                status: "error",
                message: "No existe el tema"
              });
            }

            return res.status(200).send({
              status: "success",
              topic: topicUpdated
            });
          }
        );

      } else {
        return res.status(400).send({
          message: "Los datos no son válidos"
        });
      }
    }
  },

  delete: function(req, res) {
    return res.status(200).send({
      message: "Método delete de Comment"
    });
  }

}

module.exports = controller;