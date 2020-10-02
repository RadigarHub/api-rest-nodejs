'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Modelo de User
var UserSchema = Schema({
  name: String,
  surname: String,
  email: String,
  password: String,
  image: String,
  role: String
});

// Para no mostrar la contraseña en los datos del usuario cuando se lista en alguna parte
UserSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;

  return obj;
}

module.exports = mongoose.model('User', UserSchema);

/*
Mongoose se encarga de crear el modelo de User en la base de datos.
Para guardarlo en la base de datos, lo pone en minúscula y en plural.
En este caso el modelo de User lo va a guardar como users.
*/