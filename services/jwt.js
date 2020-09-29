'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

exports.createToken = function(user) {

  // Todos los datos del usuario que queremos incluir dentro del token
  var payload = {
    sub: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix()
  };

  const key = 'clave-secreta-para-generar-el-token-9999';

  return jwt.encode(payload, key);

};