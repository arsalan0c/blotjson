const port = 9101;
let result = "";

// establish websocket connection between frontend and backend
let webSocket = new WebSocket("ws://localhost:" + port);

webSocket.onmessage = jsonData => {
  document.body.innerHTML = jsonHTML(JSON.parse(jsonData.data));
  // console.log(jsonData);
};

function jsonHTML(jsonData) {
  for (item in jsonData) {
    result += "<div>" + item;
    result += "<div style='padding-left: 20px;'>";

    if (typeof(jsonData[item]) == 'object') {
      result += jsonHTML(jsonData[item]);
    } else {
      result += jsonData[item];
    }

    result += "</div><\div>";
  }

  return result;
}
