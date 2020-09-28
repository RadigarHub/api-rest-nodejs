'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar Express
var app = express();

// Cargar archivos de rutas


// Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS


// Reescribir rutas


// Ruta/método de prueba
app.get('/prueba', (req, res) => {
  return res.status(200).send("<h1>Hola mundo soy el backend</h1>");
  /*
  return res.status(200).send({
    nombre: 'Rafael Díaz',
    message: 'hola mundo desde el backend con nodejs'
  });
  */
});


// Exportar el módulo
module.exports = app;