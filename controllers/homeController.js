const mongoose = require('mongoose') 
const Vacante = require('../models/Vacantes')

exports.mostrarTrabajos = async (req, res, next) => {

    const vacantes = await Vacante.find();

    if(!vacantes) return next();

    res.render('home', {
        nombrePagina: 'employeeDev',
        tagline: 'Encuentra y Pública Trabajos para desarrolladores Web y IBM i', 
        barra: true,
        boton: true,
        vacantes
    })
} 