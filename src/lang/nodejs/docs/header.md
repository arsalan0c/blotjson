![Alt text](./images/logo_light.svg)
# blotjson

**Blot:**
> a procedure in which proteins or nucleic acids separated on a gel are transferred directly to an immobilizing medium for identification.


*blotjson* displays [JSON](https://www.json.org/json-en.html) in a browser, directly from backend application code to make it easier to make sense of API responses. This is especially if they are not well documented.


## Basic Usage

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
