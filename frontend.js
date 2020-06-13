const host = window.location.host;
var data = "input test..";

var webSocket = new WebSocket("ws://" + host);
webSocket.onmessage = function(){
    console.log("server connected");
    //document.getElementById("input-area").innerHTML += "<div>" + data + "</div>";
};

var htmlData = "";
var allJsonObjects = [];

// establish websocket connection between frontend and backend
var webSocket = new WebSocket("ws://" + host);

webSocket.onmessage = function (json) {
    allJsonObjects.push(JSON.parse(json.data));
    console.log(allJsonObjects);
    displayData();
}

function jsonConversion(jsonData) {

    var input = "";

    for (item in jsonData) {
        input += "<div .individual-data>" + item + "<hr>" + "</div>";
        if (typeof (jsonData[item]) === "object") {
            input += jsonConversion(jsonData[item]);
        } else {
            input += jsonData[item];
        }
    }
    return input;
}

function displayData() {
    htmlData = "";

    allJsonObjects.forEach(data => {
        htmlData += jsonConversion(data);
    });

    document.getElementById("input-area").innerHTML = htmlData;
}
