'use strict';

const express = require("express");
const socket = require("socket.io");
const client = require("socket.io-client");


const PORT = 8123;
const app = express();
const server = app.listen(PORT, function () {
    console.log('Started listener on ' + PORT)
});
const io = socket(server);


io.on("connection", function (socket) {

    var clientSocket = client.connect("http://" + process.env.BACKEND_SERVER + ":8123");
    console.log("Backend connection on " + process.env.BACKEND_SERVER + " is " + clientSocket.connected)
    socket.on("connectcode", function (data) {
        clientSocket.emit("connectcode",data)
        console.log('connectcode: ' + data)
    });

    socket.on("state", function (data) {
        clientSocket.emit("state", data);
        console.log('state: ' + data)
    });

    socket.on("player", function (data) {
        clientSocket.emit("player", data);
        console.log('player: ' + data)
    });
});