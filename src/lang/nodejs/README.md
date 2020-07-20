<p align=center>
  <a><img src=https://github.com/arsalanc-v2/blotjson/workflows/Nodejs%20CD/badge.svg></a>
  <a><img src=https://github.com/arsalanc-v2/blotjson/workflows/Nodejs%20CI%20Build/badge.svg></a>
  <a><img src=https://img.shields.io/codecov/c/github/arsalanc-v2/blotjson/master.svg></a>
  <a href="https://codeclimate.com/github/arsalanc-v2/blotjson/maintainability"><img src="https://api.codeclimate.com/v1/badges/c9aeea9413e7fd863224/maintainability" /></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-dae1e7.svg"></a>
</p>
<p align=center><img src="https://github.com/arsalanc-v2/blotjson/logo_light.svg"></p>

<p align=center><b>blotjson</b></p>

<p align=center><i>blotjson</i> is a tool to help you make sense of API responses by displaying <i>JSON</i> in a browser, <br />directly from backend code where the <i>JSON</i> is received</p>

---

## Why *blotjson*?
* There is no need to copy/paste or export your data
* Everything is done locally on your own computer
* An arbitrary number of JSON datum can be easily visualised
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
<dt><a href="#startServer">startServer(port)</a></dt>
<dd><p>Creates and sets up a server which listens on the specified port</p>
</dd>
<dt><a href="#setWebsocket">setWebsocket(jsonStr)</a></dt>
<dd><p>Sets up the websocket on the server end. Defines event handlers for web socket connection.</p>
</dd>
<dt><a href="#renderFile">renderFile(response, relativePath, contentType)</a></dt>
<dd><p>Renders a file as part of a response to a request</p>
</dd>
<dt><a href="#validateJSON">validateJSON(jsonStr)</a></dt>
<dd><p>Validates that the argument is a valid JSON text or JSON value</p>
</dd>
<dt><a href="#validatePort">validatePort(port)</a></dt>
<dd><p>Validates that the argument is a valid port number</p>
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

<a name="startServer"></a>

## startServer(port)
Creates and sets up a server which listens on the specified port

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | Port on which the server listens |

<a name="setWebsocket"></a>

## setWebsocket(jsonStr)
Sets up the websocket on the server end. Defines event handlers for web socket connection.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| jsonStr | <code>\*</code> | json data passed as argument to first visualise call |

<a name="renderFile"></a>

## renderFile(response, relativePath, contentType)
Renders a file as part of a response to a request

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>\*</code> | Object representing the response |
| relativePath | <code>String</code> | Relative path to the file to be rendered |
| contentType | <code>String</code> | The media type of the file |

<a name="validateJSON"></a>

## validateJSON(jsonStr)
Validates that the argument is a valid JSON text or JSON value

**Kind**: global function  
**Throws**:

- Throws error if the argument is an invalid JSON value


| Param | Type | Description |
| --- | --- | --- |
| jsonStr | <code>\*</code> | Argument passed by user to visualise |

<a name="validatePort"></a>

## validatePort(port)
Validates that the argument is a valid port number

**Kind**: global function  
**Throws**:

- Throws error if the argument is an invalid port number


| Param | Type | Description |
| --- | --- | --- |
| port | <code>Number</code> | Port number to be validated |


## Acknowledgements

The design of displaying the data is in part inspired by [Swagger](https://swagger.io)
