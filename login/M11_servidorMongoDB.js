/*
 * Servidor HTTP millorat amb Node JS. 
 * Connecta amb MongoDB i realitza diverses operacions CRUD
 * @author sergi grau, sergi.grau@fje.edu
 * @version 2.0
 * date 06.04.2017
 * format del document UTF-8
 *
 * CHANGELOG
 * 08.04.2016
 * - Connecta amb MongoDB i realitza diverses operacions CRUD
 * 06.04.2017
 * - millora la sortida de les operacions realitzades amb mongodb
 * 01.11.2021
 * - actualització a client MongoDB 4.x  
 * NOTES
 * ORIGEN
 * Desenvolupament Aplicacions Web. Jesuïtes el Clot
 */
let http = require("http");
let fs = require('fs');

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

        if (ruta == '/login') {
            fs.readFile('./M11_mongoDB.html', function (err, sortida) {
                response.writeHead(200, {
                    "Content-Type": "text/html; charset=utf-8"
                });
                fs.readFile('./estils.css', function (err, sortida) {
                    response.writeHead(200, {
                        "Content-Type": "text/css; charset=utf-8"
                    });
                });
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


                fs.readFile('./M11_mongoDB.html', function (err, sortida) {
                    response.writeHead(200, {
                        "Content-Type": "text/html; charset=utf-8"
                    });
                    response.write(sortida);
                    response.end();
                });
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