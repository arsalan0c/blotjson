var blot = require("./index.js");
var testData = {
    "object a": "string a",
    "object nest": {
        "nested object": {
            "nested object": "string nested in object b"
        },
    },
    "object b" : "string b"
}

var testData2 = {
    "second object" : 12345,
    "array objects" : ["one", "two" ,"three"],
    "array object" : [{"a": {"b": "string ab"}}, "two" ,"three"]

}

var testData3 = {
        "quiz": {
            "sport": {
                "q1": {
                    "question": "Which one is correct team name in NBA?",
                    "options": [
                        "New York Bulls",
                        "Los Angeles Kings",
                        "Golden State Warriros",
                        "Huston Rocket"
                    ],
                    "answer": "Huston Rocket"
                }
            },
            "maths": {
                "q1": {
                    "question": "5 + 7 = ?",
                    "options": [
                        "10",
                        "11",
                        "12",
                        "13"
                    ],
                    "answer": "12"
                },
                "q2": {
                    "question": "12 - 8 = ?",
                    "options": [
                        "1",
                        "2",
                        "3",
                        "4"
                    ],
                    "answer": "4"
                }
            }
        }
    }

blot.openManually();
blot.visualise(testData);
blot.visualise(testData2);
blot.visualise(testData3);
