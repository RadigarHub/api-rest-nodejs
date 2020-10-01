'use strict'

var controller = {

  test: function(req, res) {
    return res.status(200).send({
      message: "hola desde el método test de TopicController"
    });
  },

  save: function(req, res) {
    // Recoger los parámetros de la petición

    // Validar los datos

    // Crear objeto a guardar

    // Asignar valores

    // Guardar el topic

    // Devolver respuesta
    return res.status(200).send({
      message: "Soy el método save"
    });
  }

}

module.exports = controller;