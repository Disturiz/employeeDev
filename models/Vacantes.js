const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        require: 'El nombre de la vacante  es obligatorio',
        trim : true,
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        require: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    }, 
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autror es obligatorio'
    }    
});
vacantesSchema.pre('save', function (next) {
    //  Crear la url
    const url = slug(this.titulo)
    this.url = `${url}-${shortid.generate()}`
   
    next()
})

vacantesSchema.index({titulo: 'text'});

module.exports = mongoose.model('Vacante', vacantesSchema)
