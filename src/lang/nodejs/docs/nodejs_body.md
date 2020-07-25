
**Installation**
```
npm i --save-dev blotjson
```
**Example**
```js
const blot = require('blotjson');

blot.visualise(JSON.stringify(
  ['foo', { 'bar': null, 'baz': 1.0 }]
));
```
