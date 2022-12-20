let http = require("http");
let fs = require('fs');
var cookie = require('cookie');
const crypto = require('crypto');

let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');     //utilitzem assercions
let data = [];

createAdmin();      // Crea l'usuari administrador en cas que no existeixi quan s'inicia el servidor.

function onRequest(req, res) {
    let sortida;
    const baseURL = req.protocol + '://' + req.headers.host + '/';
    const reqUrl = new URL(req.url, baseURL);
    const ruta = reqUrl.pathname;
    if (!ruta.includes(".")) console.log("Petició per a  " + ruta + " rebuda.");     // Mostra només les peticions a rutes i no als arxius.
    let cadenaConnexio = 'mongodb://127.0.0.1:27017/GP1';

    // LOGIN
    if (ruta == '/') {
        res.writeHead(301, {
            Location: `/login`
        }).end();
    }
    else if (ruta == '/login') {
        res.setHeader('Set-Cookie', ['id=; Max-Age=0', 'user=; Max-Age=0']);    // Esborrem les cookies existents
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
        let username = reqUrl.searchParams.get('nom');
        let password = reqUrl.searchParams.get('password');
        login(username, password);
    }

    else if (ruta == '/error') {
        fs.readFile('./error_inici_sessio.html', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }

    else if (ruta == '/calendari') {
        let cookies = cookie.parse(req.headers.cookie || '');
        let usuari = cookies.user;
        let id = cookies.id;
        if (usuari) {
            console.log('Benvingut usuari \"' + usuari + '\" amb ID ' + id) + '.';
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

    else if (ruta == '/get-data') {
        const client = new MongoClient('mongodb://127.0.0.1:27017/');
        const db = client.db('GP1');
        const collection = db.collection("events");
        collection.find().toArray()
            .then(documents => {
                res.writeHead(200, { 'Content-Type': 'text/json' });
                res.end(JSON.stringify(documents));
                client.close();
            })
            .catch(err => {
                console.error(err);
                client.close();
            });

    }

    else if (ruta == '/save-data') {
        const client = new MongoClient('mongodb://127.0.0.1:27017/');
        const db = client.db('GP1');
        const collection = db.collection("events");
        collection.deleteMany({});
        let body = '';

        req.on('data', (chunk) => {
          body += chunk;
        });
    
        req.on('end', () => {
          const events = JSON.parse(body);
          console.log(events); // ['a', 'b', 'c']
          collection.insertMany(events, function(err, result) {
            console.log("Insertats documents a la colecció.");
          });
        });
    
        res.end();
    }

    else if (ruta == '/calendari.png') {
        fs.readFile('./calendari/calendari.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
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
    else if (ruta == '/futbol.png') {
        fs.readFile('./serveis/futbol.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/basket.png') {
        fs.readFile('./serveis/basket.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/tennis.png') {
        fs.readFile('./serveis/tennis.png', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/png; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/escacs.jpg') {
        fs.readFile('./serveis/escacs.jpg', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/jpg; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/angles.jpg') {
        fs.readFile('./serveis/angles.jpg', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/jpg; charset=utf-8"
            });
            res.write(sortida);
            res.end();
        });
    }
    else if (ruta == '/cuina.jpg') {
        fs.readFile('./serveis/cuina.jpg', function (err, sortida) {
            res.writeHead(200, {
                "Content-Type": "image/jpg; charset=utf-8"
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

    else {
        res.writeHead(404, {
            "Content-Type": "text/html; charset=utf-8"
        });
        sortida = "404 NOT FOUND";
        res.write(sortida);
        res.end();
    }

    async function login(username, password) {
        const client = new MongoClient('mongodb://127.0.0.1:27017/');
        try {
            await client.connect();
            const db = client.db('GP1');
            const user = await db.collection('usuaris').findOne({ user: username });
            if (user) {
                const [salt, hashedPassword] = user.password.split('$');
                const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
                if (hash === hashedPassword) {
                    console.log('Iniciant sessió...');
                    fPosaCookie(user._id, username);
                } else {
                    console.log('Contrasenya incorrecta.');
                    res.writeHead(301, {
                        Location: `/error`
                    }).end();
                }
            } else {
                createUser(username, password);
            }
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
    }

    async function createUser(username, password) {
        const hashedPassword = hashPassword(password);
        const client = new MongoClient('mongodb://127.0.0.1:27017/');
        try {
            await client.connect();
            const db = client.db('GP1');
            const result = await db.collection('usuaris').insertOne({ user: username, password: hashedPassword });
            console.log('Nou usuari creat.');
            fPosaCookie(result.insertedId, username);
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
    }

    function fPosaCookie(idUsuari, username) {
        let cookies = [
            `id=${idUsuari}`,
            `user=${username}`
        ];
        console.log(cookies);
        res.setHeader('Set-Cookie', cookies, {
            httpOnly: false,
            maxAge: 60 * 15 // 15 minuts
        });
        res.statusCode = 302;
        res.setHeader('Location', '/calendari');
        res.end();

    }
}

function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');

    return [salt, hash].join('$');
}

async function createAdmin() {
    const admin = 'admin';
    const password = '12345678Ab_'
    const hashedPassword = hashPassword(password);
    const client = new MongoClient('mongodb://127.0.0.1:27017/');
    try {
        await client.connect();
        const db = client.db('GP1');
        const user = await db.collection('usuaris').findOne({ user: admin });
        if (user) {
            return 0;
        } else {
            const result = await db.collection('usuaris').insertOne({ user: admin, password: hashedPassword });
            console.log('Usuari administrador creat.');
        }
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

http.createServer(onRequest).listen(8888);
console.log("Servidor iniciat.");