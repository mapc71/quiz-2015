var models = require('../models/models.js');


exports.load = function (req, res, next, quizId) {
    models.Quiz.findById(quizId).then(
        function(quiz){
            if (quiz) {
                req.quiz = quiz;
                next();
            } else {
                next(new Error('No existe quizId =' + quizId));
            }
        }).catch(function(error){ next(error);});
};


//GET /quizes
exports.index = function(req,res){
    var search = (req.query.search || '');
    var csearch = '%' + search.replace(' ','%') +'%';

    models.Quiz.findAll({where: ["pregunta like ?", csearch]}).then(function(quizes){
        res.render('quizes/index.ejs',{quizes: quizes, search: search, errors:[]});
    }).catch(function(error){ next(error);});
};


//GET /quizes/:id
exports.show = function(req,res){
    res.render('quizes/show',{quiz: req.quiz,errors:[]});
};


//GET /quizes/:id/answer
exports.answer = function(req,res){
    var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
            resultado = 'Correcto';
    }
    res.render('quizes/answer',{quiz: req.quiz, respuesta:resultado, errors:[]});
};

//GET /quizes/new
exports.new = function(req,res){
   //crea un objeto quiz
    var quiz = models.Quiz.build(
       {pregunta: "Pregunta", respuesta: "Respuesta"}
   );

    res.render('quizes/new',{quiz: quiz, errors:[]});
};

//GET /quizes/create
exports.create = function(req,res){

    var quiz = models.Quiz.build(req.body.quiz);

    //Guarda en DB
    quiz.validate().then(function (err) {
        if(err){
            res.render('quizes/new',{quiz: quiz, errors: err.errors});
        }else{
            quiz.save({fields:["pregunta", "respuesta"]}).then(
                function(){
                    res.redirect('/quizes');
                }
            );
        }
    })

};