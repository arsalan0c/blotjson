![Alt text](./logo_light.svg) 
# blotjson

**Blot:**
> a procedure in which proteins or nucleic acids separated on a gel are transferred directly to an immobilizing medium for identification.


*blotjson* displays [JSON](https://www.json.org/json-en.html) in a browser, directly from backend application code to make it easier to make sense of API responses. This is especially if they are not well documented.


## Basic Usage

### Node.js
**Installation**
```
npm i --save-dev blotjson
```
**Example**
```js
const blot = require('blotjson');

blot.visualise(JSON.stringify(
  ['foo', {'bar': ('baz', null, 1.0, 2)}]
));
```

## Functions

<dl>
<dt><a href="#visualise">visualise(jsonStr)</a></dt>
<dd><p>Displays json data in a browser</p>
</dd>
<dt><a href="#setPort">setPort(customPort)</a> ⇒ <code>Object</code></dt>
<dd><p>Sets the port of the server to a custom user-defined port</p>
</dd>
<dt><a href="#shouldOpenBrowser">shouldOpenBrowser(bool)</a> ⇒ <code>Object</code></dt>
<dd><p>Configures whether the browser should open automatically</p>
</dd>
</dl>

<a name="visualise"></a>

## visualise(jsonStr)
Displays json data in a browser

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| jsonStr | <code>String</code> | Stringified JSON data to be viewed |

<a name="setPort"></a>

## setPort(customPort) ⇒ <code>Object</code>
Sets the port of the server to a custom user-defined port

**Kind**: global function
**Returns**: <code>Object</code> - Object whose keys point to the blot functions, to allow function chaining

| Param | Type | Description |
| --- | --- | --- |
| customPort | <code>Number</code> | Port which the user wants to use for the network connection between browser and server. Default port of 9101 will be used if not provided by user |

<a name="shouldOpenBrowser"></a>

## shouldOpenBrowser(bool) ⇒ <code>Object</code>
Configures whether the browser should open automatically

**Kind**: global function
**Returns**: <code>Object</code> - Object whose keys point to the blot functions, to allow function chaining

| Param | Default | Description |
| --- | --- | --- |
| bool | <code>true</code> | Whether the browser should open automatically |

## Features
* JSON is pretty printed
* objects and arrays can be collapsed for simpler exploration
* supports dark mode

## Why *blotjson*?
* An external application is not required. There is no need to copy/paste or export your data
* An arbitrary number of JSON data can be visualised simply
* Security. Everything is done locally on your own computer.


## Acknowledgements

The design of displaying the data is in part inspired by [Swagger](https://swagger.io) 
