const http = require('http');
const open = require('open');
const fs = require('fs');
const WebSocketServer = require('websocket').server;
const errors = require('./errorMessages.js');

/* CONSTANTS */

// Frontend file paths
const HTML_FILE_PATH = 'index.html';
const JS_FILE_PATH = 'frontend.js';

const DEFAULT_PORT = 9101;
const HOST = 'http://127.0.0.1';

/* NETWORKING VARIABLES */

let httpServer = null;
let connection = null; // refers to the web socket connection to the client once connection is established
let isRunning = false; // to perform processes only on first call such as server setup
let port = DEFAULT_PORT;

let openBrowser = true;

/* array to store data received before the websocket handshake is established.
  Once handshake established, the data will get sent */
const waitingData = [];

exports.visualise = visualise;
exports.setPort = setPort;
exports.openManually = openManually;

/**
 * Displays json data in a browser
 * @param {String} jsonStr Stringified JSON data to be viewed
 */
function visualise(jsonStr) {
  // ensure jsonStr is valid
  validateJSON(jsonStr);

  // overhead of server creation only done on first call
  if (!isRunning) {
    isRunning = true;

    waitingData.push(jsonStr);

    startServer(port);
    setWebsocket();
  } else if (!connection) {
    waitingData.push(jsonStr);
  } else {
    connection.send(jsonStr);
  }
}

/**
 * Sets the port of the server to a custom user-defined port
 * @param {Number} customPort Port which the user wants to use for the network connection between browser and server. Default port of 9101 will be used if not provided by user
 * @return {Object} Object whose keys point to the other blot functions
 */
function setPort(customPort) {
  validatePort(customPort);
  port = customPort;
  return {
    visualise: visualise,
    openManually: openManually
  };
}

/**
 * Stops the browser from automatically opening
 * @return {Object} Object whose keys point to the other blot functions
 */
function openManually() {
  openBrowser = false;
  return {
    visualise: visualise,
    setPort: setPort
  };
}

/**
 * Renders a file as part of a response to a request
 * @param {*} response Object representing the response
 * @param {String} filepath Path to the file to be rendered
 * @param {String} contentType The media type of the file
 */
function renderFile(response, filepath, contentType) {
  fs.readFile(filepath, (err, data) => {
    if (err) {
      console.log(err);
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

/**
 * Creates and sets up a server which listens on the specified port
 * @param {Number} port Port on which the server listens
 */
function startServer(port) {
  httpServer = http.createServer((req, res) => {
    switch (req.url) {
      case '/':
        renderFile(res, HTML_FILE_PATH, 'text/html');
        break;
      case '/' + JS_FILE_PATH:
        renderFile(res, JS_FILE_PATH, 'text/javascript');
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
    console.log('Server listening on port ' + port);

    // show index.html in the browser
    if (openBrowser) {
      open(HOST + ':' + port);
    }
  });
}

/**
 * Sets up the websocket on the server end. Defines event handlers for web socket connection.
 * @param {*} jsonStr json data passed as argument to first visualise call
 */
function setWebsocket() {
  const webSocket = new WebSocketServer({
    httpServer: httpServer
  });
  webSocket.on('request', (request) => {
    connection = request.accept(null, request.origin);

    connection.on('close', () => console.log('Connection closed'));

    connection.on('message', (message) => console.log(message));

    waitingData.forEach((data) => {
      connection.send(data);
    });
  });
}

/**
 * Validates that the argument passed to visualise is a valid JSON string
 * @param {*} jsonStr Argument passed by user to visualise
 * @throws Throws error if the argument is an invalid JSON value
 */
function validateJSON(jsonStr) {
  try {
    if (!jsonStr) {
      throw new Error();
    }
    JSON.parse(jsonStr);
  } catch (e) {
    throw new Error(errors.INVALID_JSON_ERROR);
  }
}

/**
 * Validates that the port passed to setPort is a valid port number
 * @param {Number} port Port number to be validated
 * @throws Throws error if the argument is an invalid port number
 */
function validatePort(port) {
  if (!Number.isInteger(port)) {
    throw new Error(errors.NON_INTEGER_PORT_ERROR);
  } else if (port <= 0 || port >= 65536) {
    throw new Error(errors.INVALID_PORT_NUMBER_ERROR);
  }
}
