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
    let authenticated = false;

//  var clientSocket = client.connect("http://" + process.env.BACKEND_SERVER + ":8123");
    var clientSocket;

//  console.log("Backend connection on " + process.env.BACKEND_SERVER + " is " + clientSocket.connected)
    socket.on("connectcode", function (data) {
        var backend;
        if (backend = authenticator.auth(data)) {
            clientSocket = client.connect("http://" + backend + ":8123");
            clientSocket.emit(`connectcode ${data}`)
            console.log(`connectcode: ${data}`)
            authenticated = true;
        } else {
            console.log(`Invalid connectcode: ${data}`)
        }
    });

    socket.on("state", function (data) {
        if (authenticated) {
            clientSocket.emit("state", data);
            console.log(`state: ${data}`)
        } else {
            console.log(`state: [unauthenticated] ${data}`)
        };
 
    });

    socket.on("player", function (data) {
        if (authenticated) {
            clientSocket.emit("player", data);
            console.log(`player: ${data}`);
        } else {
            console.log(`player: [unauthenticated] ${data}`)
        };

    });

    socket.on("disconnect", function (data) {
        console.log(`Client disconnect reason: ${data}`)
        clientSocket.disconnect();
        activeConnections.delete(socket.id);
    });

});
