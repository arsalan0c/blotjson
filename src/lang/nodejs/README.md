<p align=center>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-dae1e7.svg"></a>
  <a><img src=https://github.com/arsalanc-v2/blotjson/workflows/Nodejs%20CD/badge.svg></a>
  <a><img src=https://github.com/arsalanc-v2/blotjson/workflows/Nodejs%20CI%20Build/badge.svg></a>
  <a><img src=https://img.shields.io/codecov/c/github/arsalanc-v2/blotjson/master.svg></a>
  <a href="https://codeclimate.com/github/arsalanc-v2/blotjson/maintainability"><img src="https://api.codeclimate.com/v1/badges/c9aeea9413e7fd863224/maintainability" /></a>
  <img src="https://img.shields.io/npm/v/blotjson">
  <img src="https://img.shields.io/bundlephobia/min/blotjson">
</p>
<p align=center><img src="https://raw.githubusercontent.com/arsalanc-v2/blotjson/master/logo_light.svg"></p>

<p align=center><b>blotjson</b></p>

<p align=center><i>blotjson</i> is a tool to help you make sense of API responses by displaying JSON in a browser, <br />directly from backend code where the JSON is received</p>

---

## Why *blotjson*?
* There is no need to copy/paste or export your data
* Everything is done locally on your own computer
* An arbitrary number of JSON datum can be easily visualised

## Installation
```
npm i --save-dev blotjson
```
## Example
```js
const blot = require('blotjson');

blot.visualise(JSON.stringify(
  { 'bar': null, 'baz': 1.0 }
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
| customPort | <code>Number</code> | Port which the user wants to use for the network connection between browser and server. Default port of 9101 will be used if not provided by user. Port value must be at least 1024 |

<a name="shouldOpenBrowser"></a>

## shouldOpenBrowser(bool) ⇒ <code>Object</code>
Configures whether the browser should open automatically

**Kind**: global function  
**Returns**: <code>Object</code> - Object whose keys point to the blot functions, to allow function chaining  

| Param | Default | Description |
| --- | --- | --- |
| bool | <code>true</code> | Whether the browser should open automatically |


## Acknowledgements

The design of displaying the data is in part inspired by [Swagger](https://swagger.io)
