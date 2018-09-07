// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

var { EventHubClient, EventPosition } = require('azure-event-hubs');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Connecting String for Local IOT Hub - S1
var connectionString = 'HostName=nicutest2.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=RGpENvmqHqGZnBDT5LUsu+w5LYObC05eByMhM6a3cto=';

// Connecting String for Lurie IOT Hub - free tier
// var connectionString = 'HostName=IoTTestLuis.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=jBbQVxZCzxfxKEF3WQpFdYwsfO8wkBviDQPKqauE2zg=';

// Error Handler for IOT Hub related messages
var iothubErrorHandler = function (err) {
  console.log(err.message);
};

//
var iothubEventHandler = function (message) {
  // Print incoming message (deubgging purpose)
  // console.log(message)
  
  // Push body of the message
  io.emit('nicudata', message.body);
};

// Connect to the partitions on the IoT Hub's Event Hubs-compatible endpoint.
// This example only reads messages sent after this application started.
var ehClient;
EventHubClient.createFromIotHubConnectionString(connectionString).then(function (client) {
  console.log("Successully created the EventHub Client from iothub connection string.");
  ehClient = client;
  return ehClient.getPartitionIds();
}).then(function (ids) {
  return ids.map(function (id) {
    return ehClient.receive(id, iothubEventHandler, iothubErrorHandler, { eventPosition: EventPosition.fromEnqueuedTime(Date.now()) });
  });
}).catch(iothubErrorHandler);


// Setup Socket event Handlers 
io.on('connection', function(socket){
  console.log('Connected to a front-end');
  socket.on('disconnect', function(){
    console.log('Disconnected to a front-end');
  });
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});