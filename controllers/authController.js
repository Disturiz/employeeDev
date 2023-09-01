const passport = require('passport');
const mongoose = require('mongoose'); 
const Vacante = require('../models/Vacantes');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Revisar si el usuario está autenticado o no
exports.verificarUsuario = (req, res, next) => {

    // Revisar el usuario
    if(req.isAuthenticated()) {
        return next(); // esta autenticado
    }

    // Redireccionar 
    res.redirect('/iniciar-sesion');
}


exports.mostrarPanel = async (req, res) => {

    // Consultar el usuario autenticado
    const vacantes = await Vacante.find({ autor: req.user._id });

    res.render('administracion', {
        nombrePagina : 'Panel de Administración',
        tagline : 'Crea y Administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre: req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout();
    req.flash('correcto', 'Cerraste Session correctamente');
    return res.redirect('/iniciar-sesion'); 
}


/** Formulario para Reiniciar el password  */
exports.formReestablecerPassword = (req, res) => {
    res.render('reestablecer-password', {
        nombrePagina : 'Restablece tu Password',
        tagline : 'Si ya tienes una Cuenta pero olvidate tu password, coloca tu email'
    })
}

// Genera el Token en la tabla del usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ email : req.body.email });

    if(!usuario) {
        req.flash('error', 'No existe esa cuenta ');
        return res.redirect('/iniciar-sesion'); 
    }
    
    // El usuario existe, general Token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;
    
    console.log(resetUrl);

    // Enviar notificación por email
    await enviarEmail.enviar({
        usuario, 
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })

    // Todo correcto
    req.flash('correcto', 'Revisa tu email para las indicaciones')
    res.redirect('/iniciar-sesion');
}

// Valida si el token es valido y el usuario existe, muestra la vista 
exports.reestablecerPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token :  req.params.token,
        expira : {
            $gt : Date.now()
        }
    });

    if(!usuario) {
        req.flash('error', 'El formulario ya no es valido, Intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Todo bien, mostrar el formulario 
    res.render('nuevo-password', {
        nombrePagina : 'Nuevo Password'
    })
}

// almacena el nuevo password en la BD
exports.guardarPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira : {
            $gt : Date.now()
        }
        
    });

    // no existe el usuario o el token es invalido
    if(!usuario) {
        req.flash('error', 'El formulario ya no es valido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Asignar nuevo password, limpiar valores previos
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;


    // agregar y eliminar valores del objeto
    await usuario.save();

    // redirigir
    req.flash('correcto', 'Password Modificado Correctamente');
    res.redirect('/iniciar-sesion');
}