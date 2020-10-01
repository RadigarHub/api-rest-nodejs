'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3999;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    console.log('La conexión a la base de datos de mongo se ha realizado correctamente.')

    // Crear el servidor
    app.listen(port, () => {
      console.log('El servidor http://localhost:3999 está funcionando.');
    });
  })
  .catch(error => consolor.log(error));