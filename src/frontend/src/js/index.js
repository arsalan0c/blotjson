const TOP_DIV = "main"; // id of the outer most div to which to add data

const EXPAND_COLLAPSE_ALL_BTN = "expand-collapse-all-btn";
const COLLAPSE_ALL_BTN_MSG = "Collapse All";
const EXPAND_ALL_BTN_MSG = "Expand All";
const COLLAPSED_OBJ = " ... ";
const CLASS_EXPANDED = "expanded";
const CLASS_COLLAPSED = "collapsed";

const host = window.location.host;
const allElements = [];
var allCollapsibles = [];

const webSocket = new WebSocket("ws://" + host);
webSocket.onmessage = (json) => {
  allCollapsibles = [];

  allElements.push(JSON.parse(json.data));
  allElements.forEach((el) => {
    displayElement(el);
  });

  registerExpandCollapseAll();
};

/**
 * Renders an element, a distinct piece of data
 * @param {*} el The element to be visualised
 */
const displayElement = (el) => {
  const htmlElement = document.createElement("div");
  htmlElement.classList.add("element");

  displayData(el, htmlElement);

  document.getElementById(TOP_DIV).appendChild(htmlElement);
};

/**
 * Renders (all forms of) data
 * @param {*} data The data to be visualised
 * @param {*} htmlElement The HTML element in which to visualise the data
 */
const displayData = (data, htmlElement) => {
  if (isObj(data)) {
    displayObject(data, htmlElement);
  } else if (Array.isArray(data)) {
    displayArray(data, htmlElement);
  } else {
    displayValue(data, htmlElement);
  }
};

/**
 * Renders an object
 * @param {*} obj The object to be visualised
 * @param {*} htmlElement The HTML element in which to visualise the object
 */
const displayObject = (obj, htmlElement) => {
  const objChildElement = document.createElement("div");
  objChildElement.style.margin = "0 15px";

  const keys = Object.keys(obj);
  const expandFn = addCollapsible(htmlElement, objChildElement);

  objChildElement.appendChild(getMiscElement("{"));
  for (const key of keys) {
    const objEntryElement = getObjEntryElement(key);
    displayData(obj[key], objEntryElement);

    objChildElement.appendChild(objEntryElement);
  }
  objChildElement.appendChild(getMiscElement("}"));

  htmlElement.appendChild(objChildElement);
  expandFn(true); // expand all collapsibles by default
};

/**
 * Renders an array
 * @param {*} arr The array to be visualised
 * @param {*} htmlElement The HTML element in which to visualise the array
 */
const displayArray = (arr, htmlElement) => {
  htmlElement.appendChild(getMiscElement("["));
  for (const el of arr) {
    displayData(el, htmlElement);
    htmlElement.appendChild(getMiscElement(","));
  }
  htmlElement.appendChild(getMiscElement("]"));
};

/**
 * Renders a primitive value
 * @param {*} val The value to be visualised
 * @param {*} htmlElement The HTML element in which to visualise the value
 */
const displayValue = (val, htmlElement) => {
  htmlElement.appendChild(getValueElement(val));
};

/**
 * Adds a button to expand/collapse a child HTML element
 * @param {*} value The value of the child HTML element
 * @param {*} parentDataElement The HTML element to which to add the button
 * @param {*} childDataElement The expanded HTML element
 * @returns A function for expanding or collapsing the child element
 */
const addCollapsible = (parentDataElement, childDataElement) => {
  const collapsedElement = getCollapsedElement();
  const collapsibleElement = getCollapsibleElement();

  let el = childDataElement;

  /**
   * Toggles the collapsible
   */
  function onClick() {
    collapsibleElement.classList.toggle(CLASS_EXPANDED);

    parentDataElement.removeChild(el);
    el = collapsibleElement.classList.contains(CLASS_EXPANDED)
      ? childDataElement
      : collapsedElement;
    parentDataElement.appendChild(el);
  }

  collapsibleElement.addEventListener("click", onClick);
  parentDataElement.appendChild(collapsibleElement);

  /**
   * Expands or collapses the collapsible depending on shouldExpand
   * @param {Boolean} shouldExpand Expands the collapsible if true. Collapses it otherwise
   */
  function expandCollapsible(shouldExpand) {
    if (shouldExpand) {
      collapsibleElement.classList.add(CLASS_EXPANDED);
    } else {
      collapsibleElement.classList.remove(CLASS_EXPANDED);
    }

    parentDataElement.removeChild(el);
    el = collapsibleElement.classList.contains(CLASS_EXPANDED)
      ? childDataElement
      : collapsedElement;
    parentDataElement.appendChild(el);
  }

  allCollapsibles.push(expandCollapsible);
  return expandCollapsible;
};

/**
 * @returns A HTML element for a collapsible button
 */
const getCollapsibleElement = () => {
  const el = document.createElement("div");
  el.classList.add("arrow");
  el.classList.add(CLASS_COLLAPSED);
  return el;
};

/**
 * @returns A HTML element for a collapsed object
 */
const getCollapsedElement = () => {
  const el = document.createElement("div");
  el.appendChild(getMiscElement("{"));
  el.appendChild(getMiscElement(COLLAPSED_OBJ));
  el.appendChild(getMiscElement("}"));
  return el;
};

/**
 * @param {String} data Components of data that is not a key or value eg. a bracket
 * @returns A HTML element for data that is not a key or a value
 */
const getMiscElement = (data) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(data));
  isArrayBracket(data) || data === COLLAPSED_OBJ
    ? el.classList.add("misc-alt")
    : el.classList.add("misc");

  return el;
};

/**
 * @param {String} key
 * @returns A HTML element for an object entry
 */
const getObjEntryElement = (key) => {
  const el = document.createElement("div");
  const keyText = getKeyElement(key);
  el.appendChild(keyText);
  el.appendChild(getMiscElement(": "));
  el.style.display = "flex";
  el.style.flexDirection = "row";
  return el;
};

/**
 * @param {String} key
 * @returns A HTML element for a key
 */
const getKeyElement = (key) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(JSON.stringify(key)));
  el.classList.add("key");
  return el;
};

/**
 * @param {String} val
 * @returns A HTML element for a value
 */
const getValueElement = (val) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(JSON.stringify(val)));
  el.classList.add("value");
  return el;
};

/**
 * @param {String} str
 * @returns true if str is the bracket of an array. false otherwise
 */
const isArrayBracket = (str) => str === "[" || str === "]";

/**
 * Registers the click handler for the button which expands/collapses all objects
 */
const registerExpandCollapseAll = () => {
  const btn = document.getElementById(EXPAND_COLLAPSE_ALL_BTN);
  btn.addEventListener("click", () => {
    btn.innerHTML =
      btn.innerHTML === COLLAPSE_ALL_BTN_MSG
        ? EXPAND_ALL_BTN_MSG
        : COLLAPSE_ALL_BTN_MSG;
    allCollapsibles.forEach((expandCollapsible) => {
      if (btn.innerHTML === COLLAPSE_ALL_BTN_MSG) {
        expandCollapsible(true);
      } else {
        expandCollapsible(false);
      }
    });
  });
};

/**
 * @param {*} data
 * @returns true if data is an object. false otherwise.
 */
const isObj = (data) =>
  typeof data === "object" && data !== null && !Array.isArray(data);
