let http = require("http");
let fs = require('fs');
var cookie = require('cookie');
var idUsuari;

let MongoClient = require('mongodb').MongoClient;
let assert = require('assert'); //utilitzem assercions

let ObjectId = require('mongodb').ObjectID;

let crud = {
    afegirDocument: function (alumne, db, err, callback) {
    }
};

function onRequest(req, res) {
    let sortida;
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const reqUrl = new URL(req.url, baseURL);
    console.log("Petició per a  " + reqUrl.pathname + " rebuda.");
    const ruta = reqUrl.pathname;
    let cadenaConnexio = 'mongodb://127.0.0.1:27017/GP1';

    // LOGIN
    if (ruta == '/') {
        res.writeHead(301, {
            Location: `/login`
        }).end();
    }
    else if (ruta == '/login') {
        fs.readFile('./login/login.html', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/logo.png') {
        fs.readFile('./login/logo.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/login.js') {
        fs.readFile('./login/login.js', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/javascript; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/imagen-fondo.png') {
        fs.readFile('./login/imagen-fondo.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    // CALENDARI 
    else if (ruta == '/calendari.css') {
        fs.readFile('./calendari/calendari.css', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/calendari.js') {
        fs.readFile('./calendari/calendari.js', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/javascript; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/desa') {
        MongoClient.connect(cadenaConnexio, function (err, client) {
            assert.equal(null, err);
            console.log("Connexió correcta");
            var db = client.db('GP1');
            db.collection('proves').findOne({ nom: reqUrl.searchParams.get('nom') })
                .then(result => {
                    if (result) {
                        console.log('Iniciant sessió...');
                        idUsuari = result._id;
                        console.log(result._id);
                        fPosaCookie(idUsuari);
                    } else {
                        db.collection('proves').insertOne({
                            "nom": reqUrl.searchParams.get('nom'),
                            "password": reqUrl.searchParams.get('password')
                        }).then(result => {
                            idUsuari = result.insertedId;
                            console.log('Usuari creat amb ID ' + idUsuari);
                            fPosaCookie(idUsuari);
                        });                        
                    }
                });
        });
    }
    else if (ruta == '/calendari') {
        let cookies = cookie.parse(req.headers.cookie || '');
        let name = cookies.id;
        if (name) {
            console.log('Benvingut ' + name);
        } else {
            console.log('Error llegint cookie.');
        }
        fs.readFile('./calendari/calendari.html', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    // INFO
    else if (ruta == '/informacio') {
        fs.readFile('./info/info.html', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/banc_temps.mp4') {
        fs.readFile('./info/banc_temps.mp4', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "video/mp4; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/info.css') {
        fs.readFile('./info/info.css', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/info.js') {
        fs.readFile('./info/info.js', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/javascript; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    // SERVEIS
    else if (ruta == '/serveis') {
        fs.readFile('./serveis/serveis.html', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/serveis.css') {
        fs.readFile('./serveis/serveis.css', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    // ESTILS
    else if (ruta == '/estils.css') {
        fs.readFile('./estils/estils.css', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/css; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/estils.js') {
        fs.readFile('./estils/estils.js', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/javascript; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/logo2.png') {
        fs.readFile('./estils/logo2.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    // CONSULTA
    else if (ruta == '/consulta') {
        MongoClient.connect(cadenaConnexio, function (err, client) {
            assert.equal(null, err);
            console.log("Connexió correcta");
            var db = client.db('GP1');

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            console.log("consulta document a col·lecció usuaris");

            let cursor = db.collection('proves').find({});

            cursor.toArray((function (err, results) {
                assert.equal(err, null);
                if (results != null) {
                    results.forEach((doc) => {
                        res.write(`usuari: ${doc.nom} | password: ${doc.password} <br>`);
                    });
                } else {
                    res.end();
                }
            }));
        });
    }

    else {
        res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8"
        });
        sortida = "404 NOT FOUND";
        res.write(sortida);
        res.end();
    }

    function fPosaCookie(idUsuari) {
        res.setHeader('Set-Cookie', cookie.serialize('id', idUsuari, {
            httpOnly: true,
            maxAge: 60 * 15 // 15 minuts
        }));
        res.statusCode = 302;
        res.setHeader('Location', '/calendari');
        res.end();   
    }
}

http.createServer(onRequest).listen(8888);
console.log("Servidor iniciat.");