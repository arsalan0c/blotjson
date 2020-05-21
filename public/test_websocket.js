const host = window.location.host;

let htmlData = "";
let jsonObjects = [];

// establish websocket connection between frontend and backend
let webSocket = new WebSocket("ws://" + host);

webSocket.onmessage = jsonData => {
  jsonObjects.push(JSON.parse(jsonData.data));
  console.log(jsonObjects);
  displayData();
};

// displays all the json objects
function displayData() {
  htmlData = "";

  jsonObjects.forEach(obj => {
      htmlData += jsonHTML(obj);
      htmlData += "<div style='height: 80px;'></div>";
  });

  document.body.innerHTML = htmlData;
}

// provide html for one object
function jsonHTML(jsonData) {

  let result = "<div>";

  for (item in jsonData) {
    result += "<div style='padding-bottom: 10px'><div style='padding: 8px 0;'>" + item + "</div>";
    result += "<div style='padding-left: 20px;'>";

    if (typeof(jsonData[item]) == 'object') {
      result += jsonHTML(jsonData[item]);
    } else {
      result += jsonData[item];
    }

    result += "</div></div>";
  }

  result += "</div>";

  return result;
}
