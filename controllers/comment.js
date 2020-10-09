'use strict'

var validator = require('validator');
const topic = require('../models/topic');
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

            // Find por el id del topic
            Topic.findById(topic._id)
              .populate('user')
              .populate('comments.user')
              .exec((err, topic) => {

                // Devolver resultado
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

                return res.status(200).send({
                  status: "success",
                  topic
                });
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
    // Obtener el id del topic y del comentario a borrar de la url
    var topicId = req.params.topicId;
    var commentId = req.params.commentId;

    // Buscar el topic
    Topic.findById(topicId, (err, topic) => {

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
      
      // Seleccionar el subdocumento (comentario)
      var comment = topic.comments.id(commentId);
  
      // Borrar el comentario
      if (comment) {
        comment.remove();

        // Guardar el topic
        topic.save((err) => {

          if (err) {
            return res.status(500).send({
              status: "error",
              message: "Error en la petición"
            });
          }

          // Devolver un resultado
          return res.status(200).send({
            status: "success",
            topic
          });
        });

      } else {
        return res.status(400).send({
          status: "error",
          message: "No existe el comentario"
        });
      }
  
    });
  }

}

module.exports = controller;