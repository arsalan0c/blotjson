const blot = require("./index.js");
const testData = {
  "Name": "Saad",
  "Age" : 21
};

blot.visualise(testData);

const testData2 = {
  "Origin": "New Mexico",
  "Favourite Singer": "John Denver",
  "Favourite Human": testData
}

blot.visualise(testData2);
