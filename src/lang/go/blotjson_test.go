package blotjson

import (
	"flag"
	"io/ioutil"
	"log"
	"math/rand"
	"net/url"
	"strconv"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/require"
)

const bigJSON = "../../test/bigTest.json"

var clientConnection *websocket.Conn
var addr = flag.String("addr", "localhost:3000", "http service address")

func beforeAll() {
	SetPort(3000)
	ShouldOpenBrowser(false)
}

func afterAll() {
	clientConnection.Close()
	clientConnection = nil
	reset()
}

func Test_Str(t *testing.T) {
	testData := ""
	err := Visualise(testData)
	require.Equal(t, invalidJSONError, err.Error())
}

func Test_StrJSON(t *testing.T) {
	testData := `""`
	checkEqualTest(t, testData)
}

func Test_Int(t *testing.T) {
	testData := "22"
	checkEqualTest(t, testData)
}

func Test_Float(t *testing.T) {
	testData := "2.2"
	checkEqualTest(t, testData)
}

func Test_Bool(t *testing.T) {
	testData := "false"
	checkEqualTest(t, testData)
}

func Test_Null(t *testing.T) {
	testData := "null"
	checkEqualTest(t, testData)
}

func Test_Array(t *testing.T) {
	testData := "[1, 2, 3, 4, 5]"
	checkEqualTest(t, testData)
}

func Test_BigJSON(t *testing.T) {
	testData, _ := ioutil.ReadFile(bigJSON)
	checkEqualTest(t, string(testData))
}

func Test_IncompleteArray(t *testing.T) {
	testData := "[1, 2,"
	err := Visualise(testData)
	require.Equal(t, invalidJSONError, err.Error())
}

func Test_MultipleArrays(t *testing.T) {
	testData := "[1, 2][3, 4]"
	err := Visualise(testData)
	require.Equal(t, invalidJSONError, err.Error())
}

func Test_IncompleteObj(t *testing.T) {
	testData := `{"k1":7,"k2":13`
	err := Visualise(testData)
	require.Equal(t, invalidJSONError, err.Error())
}

func Test_MultipleObj(t *testing.T) {
	testData := `{"k1":7,"k2":13}{"k3":10,"k4":15}`
	err := Visualise(testData)
	require.Equal(t, invalidJSONError, err.Error())
}

func Test_MultipleCallsImmediate(t *testing.T) {
	multipleCalls(t, 1000, false)
}

func Test_MultipleCallsDelayed(t *testing.T) {
	multipleCalls(t, 1000, true)
}

func TestPortLower(t *testing.T) {
	err := SetPort(minPort - 1)
	require.Equal(t, invalidPortNumberError, err.Error())
}

func TestPortBoundaries(t *testing.T) {
	errMin := SetPort(minPort)
	require.Equal(t, nil, errMin)

	errMax := SetPort(maxPort)
	require.Equal(t, nil, errMax)
}

func TestPortHigher(t *testing.T) {
	err := SetPort(maxPort + 1)
	require.Equal(t, invalidPortNumberError, err.Error())
}

func multipleCalls(t *testing.T, numData int, shouldDelay bool) {
	beforeAll()
	for i := 0; i < numData; i++ {
		testData := strconv.Itoa(i)
		err := Visualise(testData)
		require.Equal(t, err, nil)
		if i == 0 {
			connect()
		}
		_, message, _ := clientConnection.ReadMessage()
		require.Equal(t, testData, string(message))

		if shouldDelay {
			time.Sleep(time.Duration(rand.Intn(20)))
		}
	}

	afterAll()
}

func checkEqualTest(t *testing.T, testData string) {
	beforeAll()

	err := Visualise(testData)
	require.Equal(t, err, nil)

	connect()

	_, message, _ := clientConnection.ReadMessage()
	require.Equal(t, testData, string(message))

	afterAll()
}

func connect() {
	u := url.URL{Scheme: "ws", Host: *addr, Path: wsURL}
	conn, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	clientConnection = conn
	if err != nil {
		log.Fatalln("Dial failed:", err.Error())
	}
}
