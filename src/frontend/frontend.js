//constants and variables
const host = window.location.host;
var webSocket = new WebSocket("ws://" + host);
var htmlData = "";
var allJsonObjects = [];
var allCollapsibles = [];


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

const demarcationElement = str => {
    const container = document.createElement("span");
    container.appendChild(document.createTextNode(str));
    container.classList.add("demarcation");
    return container;
}

const valueElement = val => {
    const container = document.createElement("span");
    container.appendChild(document.createTextNode(val));
    container.classList.add(typeof val);
    return container;
};

const getKeyElement = val => {
    const container = document.createElement("span");
    container.appendChild(document.createTextNode(JSON.stringify(val)));
    container.classList.add("key");
    return container;
}

const dataValue = (val, expanded) => {
    const valueText = document.createElement("span");
    if (typeof val === "object" && Object.keys(val).length > 0) {
        valueText.appendChild(demarcationElement("{"));
        if (expanded) {
            const keys = Object.keys(val);
            for (const key of keys) {
                valueText.appendChild(demarcationElement(" "));
                valueText.appendChild(getKeyElement(key));
                valueText.appendChild(demarcationElement(": "));
                valueText.appendChild(document.createTextNode(JSON.stringify(val[key])));
                valueText.appendChild(demarcationElement(","));
            }
            valueText.appendChild(demarcationElement(" "));
        } else {
            valueText.appendChild(document.createTextNode(" ... "));
        }

        valueText.appendChild(demarcationElement("}"));
    } else {
        valueText.appendChild(document.createTextNode(JSON.stringify(val)));
    }

    valueText.style.color = "#D55672";
    valueText.style.margin = "0 5px";
    return valueText;
};

function checkType(o){
    return Object.prototype
                     .toString
                     .call(o)
                     .replace(/\[|object\s|\]/g, '')
                     .toLowerCase();
}

const addCollapsible = (value, keyElement, responseDataElement) => {
    const collapsible = document.createElement("div");
    collapsible.classList.add("arrow");
    collapsible.classList.add("collapsed");

    collapsible.addEventListener("click", onClick);
    keyElement.appendChild(collapsible);

    let el = responseDataElement;
    function onClick() {
        collapsible.classList.toggle("expanded");

        keyElement.removeChild(el);
        el = collapsible.classList.contains("expanded") ? responseDataElement : dataValue(value, false);
        keyElement.appendChild(el);
    }

    function expand() {
        collapsible.classList.add("expanded");
        keyElement.removeChild(el);
        el = responseDataElement;
        keyElement.appendChild(el);
    }

    function contract() {
        collapsible.classList.remove("expanded")
        keyElement.removeChild(el);
        el = dataValue(value, false);
        keyElement.appendChild(el);
    }

    allCollapsibles.push({expand, contract});
    return expand;
}

const populateData = (data, dataElement) => {
    if (checkType(data) === 'object') {
        const childDataElement = document.createElement("div");
        childDataElement.style.margin = "0 15px";

        const keys = Object.keys(data);  
        const expandFn = addCollapsible(data, dataElement, childDataElement);

        childDataElement.appendChild(demarcationElement("{"));

        for (const key of keys) {
            const keyElement = document.createElement("div");

            const keyText = getKeyElement(key);
            keyElement.appendChild(keyText);
            keyElement.appendChild(demarcationElement(": "));
            keyElement.style.display = "flex";
            keyElement.style.flexDirection = "row";
    
            populateData(data[key], keyElement);

            childDataElement.appendChild(keyElement);
        }

        childDataElement.appendChild(demarcationElement("}"));            
        dataElement.appendChild(childDataElement);
        expandFn();
    } else if (Array.isArray(data)) {
        dataElement.appendChild(demarcationElement("["));

        for (const el of data) {
            populateData(el, dataElement);
            dataElement.appendChild(demarcationElement(","));
        }

        dataElement.appendChild(demarcationElement("]"));
    } else {
        dataElement.appendChild(dataValue(data, false));
    }
};

const populateElement = data => {
    const responseElement = document.createElement("div");
    responseElement.classList.add("response");

    populateData(data, responseElement);

    document.getElementById("main").appendChild(responseElement);
};

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
    allCollapsibles = [];
    allJsonObjects.forEach(data => {
        //htmlData += jsonConversion(data) + "<hr>";
        populateElement(data)
    });

    const expandContractAll = document.getElementById("expand-contract-all-btn");
    expandContractAll.addEventListener("click", () => {
        expandContractAll.innerHTML = expandContractAll.innerHTML === "Contract" ? "Expand" : "Contract";
        allCollapsibles.forEach(c => {
            if (expandContractAll.innerHTML === "Contract") {
                c.expand();
            } else {
                c.contract();
            }
        })
    })
}
