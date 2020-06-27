//constants and variables
const host = window.location.host;
var webSocket = new WebSocket("ws://" + host);
var htmlData = "";
var allJsonObjects = [];


// establish websocket connection between frontend and backend
var webSocket = new WebSocket("ws://" + host);

/*
Upon the onmessage event of a websocket, the parsed JSON data is pushed into the
allJsonObjects array
*/
webSocket.onmessage = function (json) {
    allJsonObjects.push(JSON.parse(json.data));
    displayData();
}

/**
 * html rendering for every individual piece of json data
 * key of json is added into a div with class of 'individual-data'
 * value of json is added into a div with class of 'data-inside'
 * @param {string} jsonData parsed JSON object
 * @returns {string} html for the jsonData
 */

function jsonConversion(jsonData) {
    var input = "";

    for (item in jsonData) {
        input += "<button class= 'text-collapse-btn'>&#9660</button>"
        input += "<div class= 'individual-data'>" + "{ " + item + ":" + "</div>";
        if (typeof (jsonData[item]) === "object") {
            input += "<br>" + "<div class = data-inside>" + jsonConversion(jsonData[item]) + "</div>";
        } else {
            input += "<div class= 'data-inside'>" + jsonData[item] + " }" + "</div>";
        }
    }
    return input;
}

/**
 * html for collective JSON objects to be presented 
 * For all JSON objects in the array of parsed JSON objects
 */

function displayData() {
    htmlData = "";

    allJsonObjects.forEach(data => {
        htmlData += jsonConversion(data) + "<hr>";
    });

    document.getElementById("input-area").innerHTML = htmlData;
    buttonCollapse();
}

//function to add buttons for text loaded with functionality of collapsing text
/**
 * to add in a button for every json object that collapses the object upon a click
 */
function buttonCollapse() {
    let collapsers = document.getElementsByClassName("text-collapse-btn");
    var collapsableData = document.querySelectorAll(".individual-data");
    var internalCollapsableData = document.querySelectorAll(".data-inside");
    for (let i = 0; i < collapsers.length; i++) {
        console.log("test");
        collapsers[i].addEventListener("click", function () {
            console.log("clicked");
            collapsers[i].classList.toggle("btn-after");
            //add collapse for this click to all text below
            for (let j = i; j < collapsableData.length; j++) {
                collapsableData[j].classList.toggle("collapse");
                internalCollapsableData[j].classList.toggle("collapse");
            }
        });
    }
}

//to expand and contract the input-area

var click = 0;
var expandBtn = document.querySelector(".expand-contract-btns");
expandBtn.addEventListener("click", function () {
    let inputArea = document.querySelector("#input-area");
    let collapseData = document.querySelectorAll(".individual-data");
    let internalData = document.querySelectorAll(".data-inside");
    click++;
    console.log(click);
    data = "";
    if (click % 2 != 0) {
        for (var i = 0; i < collapseData.length; i++) {
            collapseData[i].innerHTML = "{...}"
            internalData[i].innerHTML = "";
            console.log("inside for loop");
        }
        //inputArea.innerHTML = "";
        expandBtn.innerHTML = "Contract";
    } else {
        expandBtn.innerHTML = "Expand";
        inputArea.innerHTML = htmlData;
        buttonCollapse();
    }
});