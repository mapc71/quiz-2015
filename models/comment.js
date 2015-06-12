/**
 * Created by mao on 12/6/15.
 */

module.exports = function(sequelize,DataTypes){
    return sequelize.define(
        'Comment',
        {texto:{
            type: DataTypes.STRING,
            validate: {notEmpty: {msg: "-> Falta Comentario"}}
        }
        }
    );
};


