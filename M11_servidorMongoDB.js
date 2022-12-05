let http = require("http");
let fs = require('fs');
var cookie = require('cookie');

let MongoClient = require('mongodb').MongoClient;
let assert = require('assert'); //utilitzem assercions

let ObjectId = require('mongodb').ObjectID;

let crud = {
    afegirDocument: function (alumne, db, err, callback) {
    }
};

function iniciar() {
    function onRequest(request, response) {
        let sortida;
        const baseURL = request.protocol + '://' + request.headers.host + '/';
        const reqUrl = new URL(request.url, baseURL);
        console.log("Petició per a  " + reqUrl.pathname + " rebuda.");
        const ruta = reqUrl.pathname;
        let cadenaConnexio = 'mongodb://127.0.0.1:27017/GP1';

        if (ruta == '/') {
            response.writeHead(301, {
                Location: `/login`
            }).end();       
        }
        
        else if (ruta == '/login') {
            fs.readFile('./login/login.html', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }

        else if (ruta == '/index.css') {
            fs.readFile('./calendari/index.css', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/css; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }

        else if (ruta == '/index.js') {
            fs.readFile('./calendari/index.js', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/javascript; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }

        else if (ruta == '/desa') {
            MongoClient.connect(cadenaConnexio, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('GP1');
                db.collection('proves').insertOne({
                    "nom": reqUrl.searchParams.get('nom'),
                    "password": reqUrl.searchParams.get('password')
                });
                assert.equal(err, null);
                console.log("Afegit document a col·lecció proves");
                var id;
                db.collection('proves').findOne({ nom:`${reqUrl.searchParams.get('nom')}`}, function(err, result) {
                    if (err) throw err;
                    console.log(result._id);
                });
                
            });
            response.writeHead(301, {
                Location: `/calendari`
            }).end();       
        }

        else if (ruta == '/calendari') {
            fs.readFile('./calendari/index.html', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });
        }

        else if (ruta == '/consulta') {
            MongoClient.connect(cadenaConnexio, function (err, client) {
                assert.equal(null, err);
                console.log("Connexió correcta");
                var db = client.db('GP1');

                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                console.log("consulta document a col·lecció usuaris");

                let cursor = db.collection('proves').find({});
                
                cursor.toArray((function (err, results) {
                    assert.equal(err, null);
                    if (results != null) {
                        results.forEach((doc) => {
                            response.write(`usuari: ${doc.nom} | password: ${doc.password} <br>`);
                        });
                    } else {
                        response.end();
                    }
                }));
            });
        }

        // INFO
        else if (ruta == '/informacio') {
            fs.readFile('./info/info.html', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }
        else if (ruta == '/banc_temps.mp4') {
            fs.readFile('./info/banc_temps.mp4', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "video/mp4; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }
        else if (ruta == '/info.css') {
            fs.readFile('./info/info.css', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/css; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }
        else if (ruta == '/info.js') {
            fs.readFile('./info/info.js', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/js; charset=utf-8"
                });
                response.write(sortida);
                response.end();
            });        
        }
        else {
            response.writeHead(404, {
                "Content-Type": "text/html; charset=utf-8"
            });
            sortida = "404 NOT FOUND";
            response.write(sortida);
            response.end();
        }
    }
    http.createServer(onRequest).listen(8888);
    console.log("Servidor iniciat.");
}

exports.iniciar = iniciar;