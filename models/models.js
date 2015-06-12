/**
 * Created by mao on 9/6/15.
 * Construye la DB
 */
var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLITE   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var dialect = (url[1]||null);
var protocol = (url[1]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var host = (url[4]||null);
var port = (url[5]||null);
var DB_name = (url[6]||null);
var storage = process.env.DATABASE_STORAGE;


//Cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD sqlite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
    {dialect:dialect,
        protocol:protocol,
        port: port,
        host: host,
        storage:storage, //Solo sqlite (.env)
        omitNull: true //Solo Postgres
    });

//importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//importar la definición de la tabla Comment en comment.js
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//Establece relación: 1 Quiz tiene de 0 a n Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//exportar definición de la tabla Quiz y Comment
exports.Quiz = Quiz;
exports.Comment = Comment;

//crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function(){
    //Ejecuta el manejador una vez creada la tabla
    Quiz.count().then(function(count){
        if(count === 0){    //si esta vacía, la inicializamos
            Quiz.create({ pregunta:'Capital de Italia',
                          respuesta: 'Roma',
                          tema: 'Otro'
            });
            Quiz.create({ pregunta:'Capital de Portugal',
                          respuesta: 'Lisboa',
                          tema: 'Otro'
            }).then(function(){console.log('Base de Datos Inicializada')});
        };
    });
});
