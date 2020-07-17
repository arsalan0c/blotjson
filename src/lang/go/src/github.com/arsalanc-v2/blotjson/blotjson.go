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

// frontend file paths
const htmlFilePath string = "./dist/index.html"
const darkLogoPath string = "./dist/images/logo_dark.svg"
const lightLogoPath string = "./dist/images/logo_light.svg"

const wsURL string = "/ws"
const htmlURL string = "/"
const lightLogoURL string = "/images/logo_light.svg"
const darkLogoURL string = "/images/logo_dark.svg"

const invalidPortNumberError string = "Invalid port number"
const invalidJSONError string = "Visualise must take in a valid JSON value"

// networking

const host = "localhost"
const minPort int = 1024
const maxPort int = 65535
const defaultPort int = 9101

var port = defaultPort
var connection *websocket.Conn
var connectionMux = sync.Mutex{}
var waitingData []string
var isRunning bool = false
var openBrowser = true
var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Displays json data in a browser
func Visualise(jsonStr string) error {
	if err := validateJSON(jsonStr); err != nil {
		return err
	}

	connectionMux.Lock()
	if !isRunning {
		isRunning = true
		waitingData = append(waitingData, jsonStr)

		connectionMux.Unlock()
		go setupServer()
	} else if connection == nil {
		waitingData = append(waitingData, jsonStr)

		// release lock after appending:
		// to avoid the case where the websocket sends all the data in waitingData before jsonStr has been appended
		connectionMux.Unlock()
	} else {
		connection.WriteMessage(websocket.TextMessage, []byte(jsonStr))
		connectionMux.Unlock()
	}

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

// Sets the port number
func setPort(customPort int) error {
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

// Sets whether the browser should be automatically opened
func shouldOpenBrowser(open bool) {
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
// Sends data in waitingData if the connection is successful
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	if conn := upgradeConnection(w, r); conn != nil {
		connectionMux.Lock()
		connection = conn

		for _, data := range waitingData {
			connection.WriteMessage(websocket.TextMessage, []byte(data))
		}

		connectionMux.Unlock()
	}
}

func upgradeConnection(w http.ResponseWriter, r *http.Request) *websocket.Conn {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		if r.Host == fmt.Sprintf("%s:%d", host, port) {
			return true
		} else {
			return false
		}
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
	connection.Close()
	connection = nil
	http.DefaultServeMux = new(http.ServeMux)

	isRunning = false
	waitingData = nil
	port = defaultPort
	openBrowser = true
}
