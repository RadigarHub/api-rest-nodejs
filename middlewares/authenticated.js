'use strict'

exports.auth = function(req, res, next) {

  console.log("Estas pasando por el middleware");

  next();

};