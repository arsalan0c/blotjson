const TOP_DIV = "main"; // id of the outer most div to which to add data

const EXPAND_ALL_BTN = "expand-all-btn";
const COLLAPSE_ALL_BTN = "collapse-all-btn";

const ELLIPSIS = " ... ";
const CLASS_EXPANDED = "expanded";
const CLASS_COLLAPSED = "collapsed";

const host = window.location.host;
const allCollapsibles = []; // stores all collapsible HTML elements for expand/collapse all functionality

const webSocket = new WebSocket("ws://" + host + "/ws");
webSocket.onmessage = (json) => {
  displayElement(JSON.parse(json.data));

  registerExpandAll();
  registerCollapseAll();
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
 * @param {*} parentElement The HTML element in which to visualise the data
 */
const displayData = (data, parentElement) => {
  if (isObj(data)) {
    displayObject(data, parentElement);
  } else if (Array.isArray(data)) {
    displayArray(data, parentElement);
  } else {
    displayValue(data, parentElement);
  }
};

/**
 * Renders an object
 * @param {*} obj The object to be visualised
 * @param {*} parentElement The HTML element in which to visualise the object
 */
const displayObject = (obj, parentElement) => {
  const objElement = document.createElement("div");
  objElement.style.margin = "0 15px";

  const keys = Object.keys(obj);
  const expandFn = addCollapsible(true, keys.length, objElement, parentElement);

  objElement.appendChild(getMiscElement("{"));
  for (const key of keys) {
    const objEntryElement = getObjEntryElement(key);
    objElement.appendChild(objEntryElement);

    displayData(obj[key], objEntryElement);
  }
  objElement.appendChild(getMiscElement("}"));

  parentElement.appendChild(objElement);
  expandFn(true); // expand all collapsibles by default
};

/**
 * Renders an array
 * @param {*} arr The array to be visualised
 * @param {*} parentElement The HTML element in which to visualise the array
 */
const displayArray = (arr, parentElement) => {
  const arrElement = document.createElement("div");
  arrElement.style.margin = "0 12px";

  const expandFn = addCollapsible(false, arr.length, arrElement, parentElement);

  arrElement.appendChild(getMiscElement("["));
  for (let i = 0; i < arr.length; i++) {
    const el = arr[i];

    arrElement.append(document.createElement("br"));
    arrElement.append(getArrayIdElement(i));
    displayData(el, arrElement);

    if (i === arr.length - 1) {
      arrElement.appendChild(document.createElement("br"));
    } else {
      arrElement.appendChild(getMiscElement(","));
    }
  }
  arrElement.appendChild(getMiscElement("]"));

  parentElement.appendChild(arrElement);
  expandFn(true);
};

/**
 * Renders a primitive value
 * @param {*} val The value to be visualised
 * @param {*} parentElement The HTML element in which to visualise the value
 */
const displayValue = (val, parentElement) => {
  parentElement.appendChild(getValueElement(val));
};

/**
 * @param i {Number} Array index for which to create the element
 * @returns A HTML element for the index of an array
 */
const getArrayIdElement = (i) => {
  const idElement = document.createElement("span");
  idElement.appendChild(document.createTextNode("\u00A0\u00A0")); // add spaces to indent the elements of the array
  idElement.appendChild(getMiscElement(" " + i + ": ", true));
  idElement.style.fontSize = "15px";

  return idElement;
};

/**
 * Adds a button to expand/collapse a child HTML element
 * @param {Boolean} isObj Whether an object or an array is being collapsed
 * @param {Number} numKeys Number of keys that the child element has
 * @param {*} childElement The expanded HTML element
 * @param {*} parentElement The HTML element to which to add the button
 * @returns A function for expanding or collapsing the child element
 */
const addCollapsible = (isObj, numKeys, childElement, parentElement) => {
  const collapsedElement = getCollapsedElement(isObj, numKeys);
  const collapsibleElement = getCollapsibleElement();
  const spaceElement = document.createTextNode("\u00A0\u00A0\u00A0\u00A0");

  let el = childElement;

  /**
   * Toggles the collapsible
   */
  function onClick() {
    collapsibleElement.classList.toggle(CLASS_EXPANDED);
    toggleChild();
  }

  /**
   * Toggles the child element between being expanded and collapsed
   */
  function toggleChild() {
    parentElement.removeChild(el);
    parentElement.removeChild(collapsibleElement);
    if (collapsibleElement.classList.contains(CLASS_EXPANDED)) {
      parentElement.appendChild(spaceElement);
      parentElement.appendChild(collapsibleElement);
      el = childElement;
    } else {
      parentElement.removeChild(spaceElement);
      parentElement.appendChild(collapsibleElement);
      el = collapsedElement;
    }

    parentElement.appendChild(el);
  }

  collapsibleElement.addEventListener("click", onClick);
  parentElement.appendChild(spaceElement);
  parentElement.appendChild(collapsibleElement);

  /**
   * Expands or collapses the collapsible depending on shouldExpand
   * @param {Boolean} shouldExpand Expands the collapsible if true. Collapses it otherwise
   */
  function expandCollapsible(shouldExpand) {
    if (
      shouldExpand &&
      !collapsibleElement.classList.contains(CLASS_EXPANDED)
    ) {
      collapsibleElement.classList.add(CLASS_EXPANDED);
      toggleChild();
    } else if (
      !shouldExpand &&
      collapsibleElement.classList.contains(CLASS_EXPANDED)
    ) {
      collapsibleElement.classList.remove(CLASS_EXPANDED);
      toggleChild();
    }
  }

  allCollapsibles.push(expandCollapsible);
  return expandCollapsible;
};

/**
 * @param {Boolean} isObj Whether the element to be collapsed is an obj or an array
 * @param {Number} numKeys Number of keys that the element to be collapsed has
 * @returns A HTML element for a collapsed object
 */
const getCollapsedElement = (isObj, numKeys) => {
  const el = document.createElement("div");
  el.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0"));

  if (isObj) {
    el.appendChild(getMiscElement("{"));
    el.appendChild(getMiscElement(ELLIPSIS, true));
    el.appendChild(getMiscElement("}"));
  } else {
    el.appendChild(getMiscElement("["));
    el.appendChild(getMiscElement(ELLIPSIS, true));
    el.appendChild(getMiscElement("]"));
  }
  el.appendChild(getMiscElement(" (" + numKeys + ")", true));

  return el;
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
 * @param {String} data Components of data that are not a key or value eg. a bracket
 * @param {Boolean} isAlt Whether an alternate style sbould be applied or not
 * @returns A HTML element for data that is not a key or a value
 */
const getMiscElement = (data, isAlt = false) => {
  const el = document.createElement("span");
  el.appendChild(document.createTextNode(data));
  el.classList.add(isAlt ? "misc-alt" : "misc");

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
  el.classList.add("obj-entry");
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
 * Registers the click handler for the button which expands all objects
 */
const registerExpandAll = () => {
  const btn = document.getElementById(EXPAND_ALL_BTN);
  btn.addEventListener("click", () => {
    allCollapsibles.forEach((expandCollapsible) => {
      expandCollapsible(true);
    });
  });
};

/**
 * Registers the click handler for the button which collapses all objects
 */
const registerCollapseAll = () => {
  const btn = document.getElementById(COLLAPSE_ALL_BTN);
  btn.addEventListener("click", () => {
    allCollapsibles.forEach((expandCollapsible) => {
      expandCollapsible(false);
    });
  });
};

/**
 * @param {*} data
 * @returns true if data is an object. false otherwise.
 */
const isObj = (data) =>
  typeof data === "object" && data !== null && !Array.isArray(data);
