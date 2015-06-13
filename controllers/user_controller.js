/**
 * Created by mao on 13/6/15.
 */

var users = {
    admin:{id:1, username:"admin", password:"1234"},
    pepe:{id:2, username:"pepe", password: "5678"}
};

exports.autentificar = function(login,passswd,callback){
    if(users[login]){
        if(passswd === users[login].password){
            callback(null, users[login]);
        }
        else { callback(new Error('Password erróneo.'));}
    }else { callback(new Error('No existe el usuario.'));}
}
