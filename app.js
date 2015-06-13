var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015')); //semilla para cifrar cookie
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());


app.use(function (req, res, next) {

  //guardar path en session.redir para despues de login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }

  //hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();

})

//controla expiración de la session (auto-logout)
app.use(function(req,res,next){

  //verificamos si hay session
  if(req.session.user){

    // el maximo tiempo sin acceder es de 2 minutos
    if((Date.now() - req.session.user.lastAccessed) > 120000){
      delete req.session.user;  //destruimos la session del usuario
    }else{
      req.session.user.lastAccessed = Date.now(); //actualizamos el ultimo acceso
    }
  }
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      errors: []
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors: []
  });
});


module.exports = app;
