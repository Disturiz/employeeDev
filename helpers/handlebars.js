module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'JQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'RPGLE', 'RPG Full Free', 'SQL', 'GraphQL', 'TypeScript', 'C#', 'PHP', 'Laravel', 'Symphony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 
        'MVC', 'SASS', 'WordPress', 'ASP.NET', 'ORACLE', 'Java', 'Rubi', 'Kotli']; 


        let html = '';
        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? ' class="activo"' : ''}>${skill}</li>`
        });

        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(` value="${seleccionado}"`), '$& selected="selected"'
        );
    },
    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores);

        console.log(errores[categoria]);
     
        let html = ''
        if (categoria.length) {
          errores[categoria].forEach((error) => {
            html += `<div class="${categoria} alerta">
                    ${error}
                </div>`
          })
        }
        return (alertas.fn().html = html);
        next();
   }
}