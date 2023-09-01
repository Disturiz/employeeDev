const mongoose = require('mongoose')
require('dotenv').config({ path: 'variables.env' })
 
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('Conectado a MongoDB')
  })
  .catch((error) => {
    console.log(error)
  })
 
mongoose.connection.on('error', (error) => {
  console.log(error)
})
 
// importar los modelos
require('../models/Usuarios')
require('../models/Vacantes')