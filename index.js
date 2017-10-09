// Nedernet Swiss Army Knife
// Written by Skyler Fly-Wilson 09/27/17
// Creative Commons Attribution-ShareAlike 4.0 International License

// load express
const express = require('express');
const app = express();
// use pug templating engine
app.set('view engine', 'pug');
// import router
const router = require('./router.js');
app.use('/', router);
// start express server
app.listen(80, function () {
  console.log('App listening on port 80!')
});
