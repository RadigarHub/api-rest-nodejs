'use strict'

var controller = {

  add: function(req, res) {
    return res.status(200).send({
      message: "Método add de Comment"
    });
  },

  update: function(req, res) {
    return res.status(200).send({
      message: "Método update de Comment"
    });
  },

  delete: function(req, res) {
    return res.status(200).send({
      message: "Método delete de Comment"
    });
  }

}

module.exports = controller;