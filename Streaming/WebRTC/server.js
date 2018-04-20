var port = 443;

var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var socket = require('socket.io');
var app = express();

//Create secure server
var privateKey = fs.readFileSync(__dirname + '/key.pem').toString();
var certificate = fs.readFileSync(__dirname + '/cert.pem').toString();
var options = {key: privateKey, cert: certificate};

app.use(express.static(__dirname, ''));

http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

var httpsServer = https.createServer(options, app);
var server = httpsServer.listen(port, function () {
    console.log('Secure server running on port: ' + port);
});

var io = socket(server);
io.on('connection', function (socket) {
    console.log('A socket connection is established');

    socket.on('message', function (data) {
        socket.broadcast.emit('message', data);
    });
});