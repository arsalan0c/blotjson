const blot = require("./index_websocket.js");
// const blot = require("./index_sse.js");

const testData = {
  name: "Saad",
  age : 21
};

blot.visualise(testData);

const testData2 = {
  origin : "New Mexico",
  favourite_singer : "John Denver",
  favourite_human : testData
}

blot.visualise(testData2);
