'use strict';

const express = require("express");
const socket = require("socket.io");
const client = require("socket.io-client");
const authenticator = require("./authenticator.js")

const PORT = 8123;
const app = express();
const server = app.listen(PORT, function () {
    console.log('Started listener on ' + PORT)
});
const io = socket(server);
const activeConnections = new Set();


io.on("connection", function (socket) {
    activeConnections.add(socket.id);
    console.log(`New connection from: ${socket.id}`);
    console.log(`Concurrent connections: ${activeConnections.size}`);
    var clientSocket;
    var backend;

    socket.on("connectcode", function (data) {
        console.log(`connectcode: ${data}`)
        backend = authenticator.auth(data);
        if (backend) {
            clientSocket = client.connect("http://" + backend + ":8123");
            clientSocket.emit(`connectcode ${data}`);
        } else {
            console.log(`Invalid connectcode: ${connectcode}`);
        }
    });

    socket.on("state", function (data) {
        if (clientSocket) {
            clientSocket.emit("state", data);
            console.log(`state: ${data}`)
        } else {
            console.log(`state: [unauthenticated] ${data}`)
        };
 
    });

    socket.on("player", function (data) {
        if (clientSocket) {
            clientSocket.emit("player", data);
            console.log(`player: ${data}`);
        } else {
            console.log(`player: [unauthenticated] ${data}`)
        };

    });

    socket.on("disconnect", function (data) {
        console.log(`Client disconnect reason: ${data}`)
        if (clientSocket) { clientSocket.disconnect(); };
        activeConnections.delete(socket.id);
    });

});
