const host = window.location.host;

var webSocket = new WebSocket("ws://" + host);
webSocket.onmessage = function () {
    console.log("server connected");
};

var htmlData = "";
var allJsonObjects = [];

// establish websocket connection between frontend and backend
var webSocket = new WebSocket("ws://" + host);

webSocket.onmessage = function (json) {
    allJsonObjects.push(JSON.parse(json.data));
    displayData();
}

function jsonConversion(jsonData) {
    var input = "";

    for (item in jsonData) {
        input += "<button class= 'text-collapse-btn'>&#9660</button>"
        input += "<div class= 'individual-data' 'collapse'>" + item + ":" + "</div>";
        if (typeof (jsonData[item]) === "object") {
            input += "<br>" + jsonConversion(jsonData[item]);
        } else {
            input += "<div class= 'data-inside'>" + jsonData[item] + "</div>";
        }
    }
    return input;
}
function buttonCollapse() {
    let collapsers = document.getElementsByClassName("text-collapse-btn");
    //console.log(collapsers.length);
    var collapsableData = document.querySelectorAll(".individual-data");
    console.log(Array.from(collapsableData));
    console.log(collapsableData);
    for (let i = 0; i < collapsers.length; i++) {
        console.log("test");
        collapsers[i].addEventListener("click", function () {
            console.log("clicked");
            //add collapse for this click to all text below
            for (let j = i; j < collapsableData.length; j++) {
                collapsableData[j].classList.toggle("collapse");
            }
        });
        //reduce size of array for every iteration as we go down the column of buttons
        //so only the text below collapses
        
        //console.log(collapsableData);
    }
}
function displayData() {
    htmlData = "";

    allJsonObjects.forEach(data => {
        htmlData += jsonConversion(data) + "<hr>";
    });

    document.getElementById("input-area").innerHTML = htmlData;
    buttonCollapse();
}


// function jsonCoversion2(jsonData) {
//     var input = "<table>";
//     for (item in jsonData) {
//         input += "<div class= 'individual-data'>" + "<tr>" + "<td>" + "<button>↑</button>" + "</td> " + "<td>" + item + ":" + "</td> </div>";
//         if (typeof (jsonData[item]) === "object") {
//             input += "<tr>" + jsonConversion(jsonData[item]) + "</tr>";
//         } else {
//             input += "<div class= 'data-inside'>"+"<td>" + jsonData[item] + "</td>" + "</tr>" + "</div>";
//         }
//     }
//     input += "</table>"
//     return input;
// }
// function displayData2() {
//     htmlData = "";

//     allJsonObjects.forEach(data => {
//         htmlData += jsonConversion2(data);
//     });
//     htmlData += ""
//     document.getElementById("input-area").innerHTML = htmlData;
// }