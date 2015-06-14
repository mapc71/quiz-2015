/**
 * Created by mao on 14/6/15.
 */
var models = require('../models/models.js');

//GET /stadistics
exports.index = function(req,res){

    var nquiz = 0;  //número de preguntas
    var ncomment = 0; //número de comentarios
    var nquizcomment = 0 //número de preguntas con comentarios
    var nquizncomment = 0 //número de preguntas sin comentarios
    var ncommentxquiz = 0 // número medio de comentarios por preguntas

    var consultas = 0; //consultas realizadas

    function callRender(){

        console.log('Render:stadistics/index.ejs',consultas);

        if(consultas === 3){  //consultas ejecutadas para mostrar estadisticas

            nquizncomment = nquiz - nquizcomment;
            ncommentxquiz = (nquiz > 0 ? ncomment / nquiz : 0).toFixed(2);

            res.render('stadistics/index.ejs',{
                nquiz:nquiz,
                ncomment:ncomment,
                nquizcomment:nquizcomment,
                nquizncomment:nquizncomment,
                ncommentxquiz:ncommentxquiz,
                errors:[]});
        }
    };

    //numero de Preguntas
    models.Quiz.count().then(function (filas) {
        console.log('ok consulta preguntas', filas);
        nquiz = filas;
        consultas++;
        callRender();
    });

    //numero de Comentarios
    models.Comment.count().then(function (filas) {
        console.log('ok consulta comentarios', filas);
        ncomment = filas;
        consultas++;
        callRender();
    });

    //numero de Preguntas con Comentarios
    models.Comment.count({
        group: ['QuizId']
    }).then(function (filas) {
        console.log('ok consulta preguntas con comentarios', filas.length);
        nquizcomment = filas.length;
        consultas++;
        callRender();
    });



};
