'use strict'

var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_node', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('La conexión a la base de datos de mongo se ha realizado correctamente.')
  })
  .catch(error => consolor.log(error));