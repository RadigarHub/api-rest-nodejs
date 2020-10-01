'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

  test: function(req, res) {
    return res.status(200).send({
      message: "hola desde el método test de TopicController"
    });
  },

  save: function(req, res) {
    // Recoger los parámetros de la petición
    var params = req.body;

    // Validar los datos
    try {
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_lang = !validator.isEmpty(params.lang);
    } catch(err) {
      return res.status(400).send({
        message: "Faltan datos por enviar"
      });
    }

    if (validate_title && validate_content && validate_lang) {
      // Crear objeto de topic
      var topic = new Topic();
      
      // Asignar valores
      topic.title = params.title;
      topic.content = params.content;
      topic.code = params.code;
      topic.lang = params.lang;
      
      // Guardar el topic
      topic.save((err, topicStored) => {
        // Devolver respuesta
        if (err || !topicStored) {
          return res.status(400).send({
            status: "error",
            message: "El tema no se ha guardado"
          });
        }

        return res.status(200).send({
          status: "success",
          topic: topicStored
        });
      });

    } else {
      return res.status(400).send({
        message: "Los datos no son válidos"
      });
    }
  }

}

module.exports = controller;