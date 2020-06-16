var blot = require("./index.js");
var testData = {
    "object a": "string a",
    "object nest": {
        "nested object": "string nested in object b"
    },
    "object b" : "string b"
}

var testData2 = {
    "second object" : 12345,
    "array object" : ["one", "two" ,"three"]
}
blot.visualise(testData);
// blot.visualise(testData2)
// console.log(typeof([1,2,3]));