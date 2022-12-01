var http = require("http");
var url = require("url");
var fs = require('fs');

function iniciar() {
    function onRequest(req, res) {
        const baseURL = req.protocol + '://' + req.headers.host + '/';
        const reqUrl = new URL(req.url, baseURL);
        console.log(reqUrl);
        console.log("Petició per a  " + reqUrl.pathname + " rebuda.");
        
        if (reqUrl.pathname == '/index.html') {
			fs.readFile('./index.html', function(err, sortida) {
				res.writeHead(200, {
					'Content-Type' : 'text/html'
				});
				res.write(sortida);
                res.end();
			});
        }
        else if (reqUrl.pathname == '/') {
			fs.readFile('./index.html', function(err, sortida) {
				res.writeHead(200, {
					'Content-Type' : 'text/html'
				});
				res.write(sortida);
                res.end();
			});
        }
        /*else if(reqUrl.pathname=='/numParell'){
            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });
            let num= parseInt(reqUrl.searchParams.get('num'));
            if (num % 2 == 0){
                res.write(`El número ${num} és PARELL.`);
            }else{
                res.write(`El número ${num} és SENAR.`);
            }
            res.end();
        }*/
    }

    http.createServer(onRequest).listen(8888);
    console.log("Servidor iniciat.");
}

exports.iniciar = iniciar;