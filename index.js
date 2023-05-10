const port = 1883
const wsPort = 8883

const aedes = require('aedes')();

const server = require('net').createServer(aedes.handle);
const httpServer = require('http').createServer()
const ws = require('websocket-stream')
const fs = require('fs');

ws.createServer({ server: httpServer }, aedes.handle)

server.listen(port, function() {
    console.log('Ades MQTT listening on port: ' + port)
})

aedes.on('client', function (client) {
    console.log(`Client connected: ${client}`);
    console.log(client);
});

aedes.on('clientDisconnect', function (client) {
    console.log(`Client disconnected: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
    console.log(`Received message on topic ${packet.topic}`);

    if (packet.topic == "image"){
        let id = packet.payload["id"]
        console.log(`Received image with id: ${id}`)
    }
});

httpServer.listen(wsPort, function () {
    console.log('Aedes MQTT-WS listening on port: ' + wsPort)
});