const http = require("http");
const open = require("open");
const fs = require("fs");
const WebSocketServer = require("websocket").server; // websocket server class

let webSocket = null;
// connection variable, to refer to the web socket connection to the client once connection is established
let connection = null;
// default port used if none is specified by the user
let defaultPort = 9101;
const host = "http://127.0.0.1";

// check if a browser window is already open
let isRunning = false;


exports.visualise = function visualise(jsonData, port = defaultPort) {

  // overhead of server creation only done on first call
  if (!isRunning) {
    isRunning = true;

    // open index.html in the browser
    open("http://127.0.0.1:" + port);

    // create http Server
    const httpServer = http.createServer((req, res) => {

      // check if the which files to render
      var url = req.url;

      switch (url) {
        case '/':
          getStaticFileContent(res, 'public/index.html', 'text/html');
          break;
        case '/public/test_websocket.js':
          getStaticFileContent(res, 'public/test_websocket.js', 'text/javascript');
          break;
        default:

          res.writeHead(404, {
            'Content-Type': 'text/plain'
          });
          res.end('404 - Page not Found');
          break;
      }

    });

    httpServer.listen(port, (req, res) => {
      console.log("Server listening on port " + port);
    });

    webSocket = new WebSocketServer({
      "httpServer": httpServer
    });

    webSocket.on("request", request => {

      // accept request
      connection = request.accept(null, request.origin);

      connection.send(JSON.stringify(jsonData));

      connection.on("close", () => console.log("Connection closed"));
      connection.on("message", message => console.log("hey now brown cow"));

    });

  } else if (connection == null) {
    setTimeout(() => visualise(jsonData, port), 500);
  } else {
    connection.send(JSON.stringify(jsonData));
  }

  // connection.send(jsonData, connection);
  // sendData(jsonData, connection);

}

// From StackOverflow
// for rendering static files
function getStaticFileContent(response, filepath, contentType) {
  fs.readFile(filepath, function(error, data) {
    if (error) {
      response.writeHead(500, {
        'Content-Type': 'text/plain'
      });
      response.end('500 - Internal Server Error');
    } else {
      response.writeHead(200, {
        'Content-Type': contentType
      });
      response.end(data, 'utf-8');
    }
  });
}