/**
 * Created by mao on 9/6/15.
 * Definición del modelo  de quiz
 */

module.exports = function(sequelize, DataTypes){
    return sequelize.define('Quiz',
        {pregunta: {
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Falta Pregunta"}}
        },
        respuesta:{
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Falta Respuesta"}}
        }
        });
}