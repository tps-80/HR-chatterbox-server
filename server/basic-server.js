/* Import node's http module: */
var http = require("http");
var messages = require('./message-handler');
var index = require('./index-handler');
var url = require('url');

var port = 3001;

var ip = "127.0.0.1";

var router = {
  '/': index.requestHandler,
  '/message': messages.requestHandler
}

var server = http.createServer(function(request, response){
  var route = router[url.parse(request.url).pathname]

  if( route ){
    route(request, response);
  } else {
    // handle bad request
  }

});







console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
