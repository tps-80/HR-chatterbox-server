/* Import node's http module: */
var http = require('http');
var messages = require('./message-handler');
var file = require('./file-handler');
var url = require('url');

var port = 3001;

var ip = "127.0.0.1";

var router = {
  //'/': index.requestHandler,
  '/message': messages.requestHandler
}

var server = http.createServer(function(request, response){
  var route = router[url.parse(request.url).pathname]
  //console.log(url.parse(request.url));
  //console.log(router)
  if( route ){
    route(request, response);
  } else {
    file.requestHandler(request, response);
  }
});







console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
