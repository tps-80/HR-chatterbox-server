//var _ = require('underscore');
var jq = require('jquery');

// used as a message storage
// TODO: implement permanent storage
var messages = {
  results: [{ text: 'asd',
  roomname: 'asd',
  username: 'lalala',
  objectId: 1445998324818 }]
};

var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers":  "Content-Type, Accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "application/json"
};

var sendResponse = function(response, data, statusCode, customHeader){
  statusCode = statusCode || 200;
  customHeader = customHeader || {};
  
  headers = jq.extend(true, defaultHeaders, customHeader);
  console.log(defaultHeaders)
  response.writeHead(statusCode, headers);
  response.end(data);
}

var storeMessage = function(message){
  message.objectId = new Date().getTime();
  messages.results.unshift(message);
  return message;
}

var actions = {
  'POST': function(request, response){
    var data = '';
    request.on('data', function(pieceOfData){
      data += pieceOfData;
    });
    request.on('end', function(){
    
      var message = JSON.parse(data);
      message = storeMessage(message);
      console.log(messages)
      var customHeader = {
        'Content-Type': 'text/plain'
      }
      sendResponse(response, 'Message received', '201', customHeader);
    });
  },
  'GET': function(request, response){
    sendResponse(response, JSON.stringify(messages));
  },
  'OPTIONS': function(request, response){
    sendResponse(response, null);
  }
};

var requestHandler = function(request, response) {
  var action = actions[request.method];
  action(request, response);
};


module.exports.requestHandler = requestHandler;

