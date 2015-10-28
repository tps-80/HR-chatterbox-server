var fs = require('fs');
var mime = require('mime');
var _ = require('underscore');

// used as a message storage
// TODO: implement permanent storage
var messages = {
  results: []
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
  
  headers = _.extend(defaultHeaders, customHeader);
  response.writeHead(statusCode, headers);
  response.end(data);
}

var addIdToMessage = function(message){
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

      sendResponse(response, 'Message received', '201', 'text/plain')
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

  // console.log(request.headers);
  // console.log("Serving request type " + request.method + " for url " + request.url);

  // var statusCode = 200;
  // var headers = defaultCorsHeaders;
  // headers['Content-Type'] = "application/json";
  // response.writeHead(statusCode, headers);




  // if(request.method === 'POST'){
  //   if(request.url === '/message'){
  //     var messageTest = '';
  //     request.on('data', function (data) {
  //       //body += data;
  //       messageTest += data;
  //       //console.log(messageTest)
  //  -->  if (messageTest.length > 1e6) { 
  //         // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
  //         request.connection.destroy();
  //       }
  //     });
  //     request.on('end', function () {
  //       var messageObj = JSON.parse(messageTest);
  //       //console.log(messageObj);
  //       messageObj.objectId = new Date().getTime()
  //       messages.results.unshift(messageObj);
  //     });
  //   }
  // } else if(request.method === 'GET'){
  //   if(request.url === '/message'){
  //     var r = JSON.stringify(messages);
  //     //console.log(r);
  //     response.end(r);
  //   } else if(request.url === '/'){
  //     headers['Content-Type'] = 'text/html'
  //     response.writeHead(statusCode, headers);
      
  //     fs.readFile(__dirname + '/../client/index.html', function (err, html) {
  //       if (err) {
  //         throw err; 
  //       }       
        
  //       response.write(html);  
  //       response.end();  
    
  //     });
  //   } else {
  //     fs.readFile(__dirname + '/../client' + request.url, function (err, file) {
  //       if(err) {
  //         throw err;
  //       }


  //       headers['Content-Type'] = mime.lookup('/../client' + request.url)
  //       response.writeHead(statusCode, headers);

  //       response.write(file);
  //       response.end();
  //     });
  //   }
  // } else if(request.method === 'OPTIONS'){
  //   if(request.url === '/message'){
  //     response.end();
  //   }
  // }



};


module.exports.requestHandler = requestHandler;

