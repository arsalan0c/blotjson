const http = require("http");
const fs = require("fs");
var opn = require("opn");
// const childProc = require('child_process');

const WebSocketServer = require("websocket").server;
let connection = null;
let port = 9101;

exports.visualise = jsonData => {

  // open index.html in the browser
  opn("./index.html");

  // create http Server
  const httpServer = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    //
    // fs.readFile("./index.html", null, (err, data) => {
    //   if (err) {
    //     res.writeHead(404);
    //     res.write("File not found!");
    //   } else {
    //     res.write(data);
    //   }
    //   res.end();
    // });
    // app.sendFile("./index.html");

  });

  httpServer.listen(port, (req, res) => {
    console.log("Server listening on port " + port);
  });

  const webSocket = new WebSocketServer({
    "httpServer": httpServer
  });

  webSocket.on("request", request => {

    // accept request
    connection = request.accept(null, request.origin);

    // send data
    connection.send(JSON.stringify(jsonData));
    connection.on("close", () => console.log("Connection closed"));
    connection.on("message", message => console.log("hey now brown cow"));

  });

};
