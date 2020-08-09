package blotjson

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"sync"

	"github.com/gorilla/websocket"
	"github.com/pkg/browser"
)

// Errors
const invalidPortNumberError string = "Invalid port number"
const invalidJSONError string = "Invalid JSON value or JSON text"

// Frontend File Paths
const htmlFilePath string = "./dist/index.html"
const darkLogoPath string = "./dist/images/logo_dark.svg"
const lightLogoPath string = "./dist/images/logo_light.svg"

// URLs
const wsURL string = "/ws"
const htmlURL string = "/"
const lightLogoURL string = "/images/logo_light.svg"
const darkLogoURL string = "/images/logo_dark.svg"

// Networking
const host = "localhost"
const minPort int = 1024
const maxPort int = 65535
const defaultPort int = 9101

var port = defaultPort
var connection *websocket.Conn
var connectionMux = sync.Mutex{}

var dataQueue []string
var isRunning = false // to perform processes only on first call such as server setup
var openBrowser = true
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Visualise Displays json data in a browser
func Visualise(jsonStr string) error {
	if err := validateJSON(jsonStr); err != nil {
		return err
	}

	dataQueue = append(dataQueue, jsonStr)
	connectionMux.Lock()
	if !isRunning {
		isRunning = true
		go setupServer()
	} else if connection != nil {
		var toSend string
		toSend, dataQueue = dataQueue[len(dataQueue)-1], dataQueue[:len(dataQueue)-1]
		connection.WriteMessage(websocket.TextMessage, []byte(toSend))
	}
	connectionMux.Unlock()

	return nil
}

// Validates that the provided JSON string is well formed
func validateJSON(jsonStr string) error {
	in := []byte(jsonStr)
	var raw interface{}
	if err := json.Unmarshal(in, &raw); err != nil {
		return errors.New(invalidJSONError)
	}

	return nil
}

// SetPort sets the port number to the provided number, which should be between 1024 and 65535 (inclusive)
func SetPort(customPort int) error {
	if err := validatePort(customPort); err != nil {
		return err
	}
	port = customPort
	return nil
}

// Validates a port number
func validatePort(port int) error {
	if port < minPort || port > maxPort {
		return errors.New(invalidPortNumberError)
	}

	return nil
}

// ShouldOpenBrowser Sets whether the browser should be automatically opened. true by default
func ShouldOpenBrowser(open bool) {
	openBrowser = open
}

// Serves the frontend files
// Sets the websocket handler
func setupServer() {
	http.HandleFunc(wsURL, handleWebSocket)
	http.HandleFunc(lightLogoURL, serveLightLogo)
	http.HandleFunc(darkLogoURL, serveDarkLogo)
	http.HandleFunc(htmlURL, serveHTML)

	if openBrowser {
		browser.OpenURL(fmt.Sprintf("http://%s:%d", host, port))
	}

	fmt.Println("Server started on port " + strconv.Itoa(port))
	http.ListenAndServe(fmt.Sprintf("%s:%d", host, port), nil)
}

// Defines the websocket handler
// Sends data in dataQueue if the connection is successful
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	if conn := upgradeConnection(w, r); conn != nil {
		connectionMux.Lock()
		connection = conn

		for len(dataQueue) > 0 {
			var toSend string
			toSend, dataQueue = dataQueue[0], dataQueue[1:]
			connection.WriteMessage(websocket.TextMessage, []byte(toSend))
		}

		connectionMux.Unlock()
	}
}

func upgradeConnection(w http.ResponseWriter, r *http.Request) *websocket.Conn {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		if r.Host == fmt.Sprintf("%s:%d", host, port) {
			return true
		}

		return false
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println(err.Error())
	}

	return conn
}

func serveHTML(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, htmlFilePath)
}

func serveLightLogo(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, lightLogoPath)
}

func serveDarkLogo(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, darkLogoPath)
}

// Resets configuration and terminates the websocket connection
func reset() {
	connectionMux.Lock()
	connection.Close()
	connection = nil
	connectionMux.Unlock()

	http.DefaultServeMux = new(http.ServeMux)
	isRunning = false
	dataQueue = nil
	port = defaultPort
	openBrowser = true
}
