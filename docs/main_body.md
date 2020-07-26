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
  { 'bar': null, 'baz': 1.0 }
));
```

For further details on how to use blotjson on Node.js, go [here](./src/lang/nodejs/README.md)
