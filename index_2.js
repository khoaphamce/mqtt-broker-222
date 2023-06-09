const aedes = require('aedes')();
const server = require('net').createServer();
const fs = require('fs');

const port = 1883; // Replace with the port you want to use for the MQTT broker

server.listen(port, function () {
  console.log(`MQTT broker listening on port ${port}`);
});

aedes.on('client', function (client) {
  console.log(`Client connected: ${client}`);
  console.log(client);
});

aedes.on('clientDisconnect', function (client) {
  console.log(`Client disconnected: ${client.id}`);
});

aedes.on('publish', function (packet, client) {
  console.log(`Received message on topic ${packet.topic}: ${packet.payload}`);
  // Do whatever you want with the received message here

  // if (packet.topic == "ai4hw"){
  //   console.log("Received image")
  //   fs.writeFileSync('image.png', packet.payload)
  // }
});

// WS server
// 