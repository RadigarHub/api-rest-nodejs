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
      topic.user = req.user.sub;
      
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
  },

  getTopics: function(req, res) {
    // Cargar la librería de paginación en la clase.
    // Se ha realizado en el modelo Topic (models/topic.js)

    // Recoger la página actual
    var page = parseInt(req.params.page);
    if (!page || page <= 0) {
      page = 1;
    }

    // Indicar las opciones de paginación
    var options = {
      sort: { date: -1 },
      populate: 'user',
      limit: 5,
      page: page
    };

    // Find paginado
    Topic.paginate({}, options, (err, topics) => {

      if (err) {
        return res.status(500).send({
          status: "error",
          message: "Error al hacer la consulta"
        });
      }

      if (!topics) {
        return res.status(400).send({
          status: "error",
          message: "No existen topics"
        })
      }

      // Devolver resultado (topics, total de topics, total de páginas)
      return res.status(200).send({
        status: "success",
        topics: topics.docs,
        totalDocs: topics.totalDocs,
        totalPages: topics.totalPages
      });
    });
  },

  getTopicsByUser: function(req, res) {
    // Conseguir el id del usuario
    var userId = req.params.user;

    // Find con la condición de usuario
    Topic.find({user: userId})
      .sort([['date', 'descending']])
      .exec((err, topics) => {

        // Devolver resultado
        if (err) {
          return res.status(500).send({
            status: "error",
            message: "Error en la petición"
          });
        }

        if (!topics) {
          return res.status(400).send({
            status: "error",
            message: "No hay temas para mostrar"
          });
        }

        return res.status(200).send({
          status: "success",
          topics
        });
    });
  },

  getTopic: function(req, res) {
    // Sacar el id del topic de la url
    var topicId = req.params.id;

    // Find por el id del topic
    Topic.findById(topicId)
      .populate('user')
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
    })
  },

  update: function(req, res) {
    // Recoger el id del topic de la url

    // Recoger los datos que llegan desde put

    // Validar los datos

    // Montar un json con los datos modificables

    // Find and update del topic por id y por id de usuario

    // Devolver una respuesta
    return res.status(200).send({
      message: "método update"
    });
  }

}

module.exports = controller;