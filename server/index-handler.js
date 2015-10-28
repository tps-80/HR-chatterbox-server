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
