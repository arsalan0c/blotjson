const http = require("http");
const open = require("open");
const fs = require("fs");

let webSocket = null;

// response which refers to the persistent connection between server and client
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

      if (req.url == "/events" && req.headers.accept && req.headers.accept == 'text/event-stream') {
        connection = res;

        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        });
      } else {

        // check if the which files to render
        switch (req.url) {
          case '/':
            getStaticFileContent(res, 'public/index.html', 'text/html');
            break;
          case '/public/test_sse.js':
            getStaticFileContent(res, 'public/test_sse.js', 'text/javascript');
            break;
          default:

            res.writeHead(404, {
              'Content-Type': 'text/plain'
            });
            res.end('404 - Page not Found');
            break;
        }

      }

    });

    httpServer.listen(port, (req, res) => {
      console.log("Server listening on port " + port);
    });

  }

  if (connection == null) {
    setTimeout(() => visualise(jsonData, port), 300);
  } else {
    sendSSEResponse(connection, jsonData);
  }

};

// send data through SSE protocol
function sendSSEResponse(res, jsonData) {
  res.write("data: " + JSON.stringify(jsonData) + "\n\n");
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
