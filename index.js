const http = require("http");
const open = require("open");
const fs = require("fs");
const WebSocketServer = require("websocket").server; // websocket server class

/**
  CONSTANTS
**/

// Frontend file paths
const HTML_FILE_PATH = "index.html";
const JS_FILE_PATH = "frontend.js";

// Host and default port (if none is specified)
const DEFAULT_PORT = 9101;
const HOST = "http://127.0.0.1";


/**
  NETWORKING VARIABLES
**/

let webSocket = null;

// connection variable, to refer to the web socket connection to the client once connection is established
let connection = null;


// check if a browser window is already open
let isRunning = false;

/**
 * @param {String} jsonStr "Stringified JSON data to be viewed"
 * @param {Number} port "Port which the user wants to use for the network connection between browser and server. Default port of 9101 will be used if not provided by user"
 */
exports.visualise = function visualise(jsonStr, port = defaultPort) {

  // overhead of server creation only done on first call
  if (!isRunning) {
    isRunning = true;

    // create http Server
    const httpServer = http.createServer((req, res) => {

      // render appropriate files
      switch (req.url) {
        case '/':
          renderFrontendFile(res, HTML_FILE_PATH, 'text/html');
          break;
        case JS_FILE_PATH:
          renderFrontendFile(res, JS_FILE_PATH, 'text/javascript');
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

      // event handlers
      connection.on("close", () => console.log("Connection closed"));
      connection.on("message", message => console.log(message));

      connection.send(jsonStr);

    });

    // open index.html in the browser
    open("http://127.0.0.1:" + port);

  } else if (connection == null) {
    setTimeout(() => visualise(jsonStr, port), 500);
  } else {
    connection.send(jsonStr);
  }

}

// for rendering static files
function renderFrontendFile(response, filepath, contentType) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
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
