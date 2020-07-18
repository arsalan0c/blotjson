const blot = require('./index.js');
const errors = require('./errorMessages.js');
const WebSocketClient = require('ws');
const fs = require('fs');
let ws = null;

beforeAll(() => {
  blot.setPort(3000).shouldOpenBrowser(false);
  ws = new WebSocketClient('ws://localhost:3000');
});

afterAll(() => {
  ws.close();
});

describe('Falsy JSON', () => {
  test('undefined', () => {
    const testData = undefined;
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('Function', () => {
    const testData = () => 'hello world';
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('null', () => {
    const testData = null;
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('Empty String', () => {
    const testData = '';
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('NaN', () => {
    const testData = NaN;
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });
});

describe('Invalid JSON tests', () => {
  test('Object', () => {
    const testData = {
      name: 'John'
    };
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('Array', () => {
    const testData = [1, 2, 3, 4];
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });

  test('Plain String', () => {
    const testData = 'hello world';
    performErrorTest({ message: testData }, errors.INVALID_JSON_ERROR);
  });
});

describe('Standard JSON tests', () => {
  test('Stringified empty string', (done) => {
    const testData = '""';
    performTest(testData, done);
  });

  test('null', (done) => {
    const testData = 'null';
    performTest(testData, done);
  });

  test('Integer', (done) => {
    const testData = '27';
    performTest(testData, done);
  });

  test('Float', (done) => {
    const testData = '3.1415';
    performTest(testData, done);
  });

  test('Object', (done) => {
    const testData = {
      name: 'John'
    };

    performTest(JSON.stringify(testData), done);
  });

  test('Array', (done) => {
    const testData = '[1,2,3,4]';
    performTest(testData, done);
  });

  test('Big JSON file', (done) => {
    let testData = null;

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    fs.readFile('../../../test/bigTest.json', 'utf8', (err, data) => {
      if (err) {
        done.fail(err);
      } else {
        testData = data;
        blot.visualise(testData);
      }
    });
  });

  test('Boolean', (done) => {
    const testData = 'true';
    performTest(testData, done);
  });

  test('Stringified plain string', (done) => {
    const testData = '"Hello World"';
    performTest(testData, done);
  });

  test('JSON text', (done) => {
    const testData = jsonText;
    performTest(testData, done);
  });

  test('Multiple function calls immediate', (done) => {
    const numData = 1000;
    let currentData = 0;

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(JSON.stringify(currentData));
      currentData++;

      if (currentData === numData) {
        done();
      }
    };

    for (let i = 0; i < numData; i++) {
      blot.visualise(JSON.stringify(i));
    }
  });

  test('Multiple function calls delayed', (done) => {
    const numData = 100;
    let currentData = 0;

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(JSON.stringify(currentData));
      currentData++;

      if (currentData === numData) {
        done();
      }
    };

    (async () => {
      for (let i = 0; i < numData; i++) {
        blot.visualise(JSON.stringify(i));
        await delay(Math.random() * 20);
      }
    })();
  });
});

describe('Falsy port numbers', () => {
  test('Port undefined', () => {
    const testPort = undefined;
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });

  test('Port null', () => {
    const testPort = null;
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });

  test('NaN', () => {
    const testPort = NaN;
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });
});

describe('Port number cases', () => {
  test('Float', () => {
    const testPort = 1.231;
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });

  test('Zero', () => {
    const testPort = 0;
    performErrorTest({ port: testPort }, errors.INVALID_PORT_NUMBER_ERROR);
  });

  test('Less than 1024 port', () => {
    const testPort = 1023;
    performErrorTest({ port: testPort }, errors.INVALID_PORT_NUMBER_ERROR);
  });

  test('Negative', () => {
    const testPort = -1234;
    performErrorTest({ port: testPort }, errors.INVALID_PORT_NUMBER_ERROR);
  });

  test('Function', () => {
    const testPort = () => {};
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });

  test('Object', () => {
    const testPort = {
      name: 'John'
    };
    performErrorTest({ port: testPort }, errors.NON_INTEGER_PORT_ERROR);
  });
});

describe('Test manual opening function', () => {
  test('Integer', () => {
    const testData = 1;
    performErrorTest(
      { openManually: testData },
      errors.NON_BOOLEAN_ARGUMENT_ERROR
    );
  });

  test('Float', () => {
    const testData = Math.PI;
    performErrorTest(
      { openManually: testData },
      errors.NON_BOOLEAN_ARGUMENT_ERROR
    );
  });

  test('Object', () => {
    const testData = {
      test: 'a quick brown fox'
    };
    performErrorTest(
      { openManually: testData },
      errors.NON_BOOLEAN_ARGUMENT_ERROR
    );
  });

  test('Function', () => {
    const testData = () => {};
    performErrorTest(
      { openManually: testData },
      errors.NON_BOOLEAN_ARGUMENT_ERROR
    );
  });

  test('String', () => {
    const testData =
      'The more I think about language, the more it amazes me that people ever understand each other at all.';
    performErrorTest(
      { openManually: testData },
      errors.NON_BOOLEAN_ARGUMENT_ERROR
    );
  });
});

/*****
 * AUXILLIARY CONSTANTS AND FUNCTIONS
 ******/

/**
 * Performs tests that throw errors
 * @param {Object} data Object that contains the data. Object is expected to have at least one of the following keys: message, port, openManually
 * @param {String} errorMessage The error message that is expected to be thrown
 */
function performErrorTest(data, errorMessage) {
  if (data.message) {
    expect(() => blot.visualise(data.message)).toThrow(errorMessage);
  }
  if (data.port) {
    expect(() => blot.setPort(data.port)).toThrow(errorMessage);
  }
  if (data.openManually) {
    expect(() => blot.shouldOpenBrowser(data.openManually)).toThrow(
      errorMessage
    );
  }
}

/**
 * Callback function to complete tests
 * @callback testCallBack
 */

/**
 * Performs non-error tests
 * @param {String} testData Data to be tested
 * @param {testCallBack} done Callback function which ends test upon being called
 */
function performTest(testData, done = () => {}) {
  ws.onmessage = (msg) => {
    expect(msg.data).toEqual(testData);
    done();
  };

  blot.visualise(testData);
}

const jsonText =
  '{ "category": "Programming", "type": "twopart", "setup": "How do you generate a random string?", "delivery": "Put a Windows user in front of Vim and tell him to exit.", "flags": { "nsfw": false, "religious": false, "political": false, "racist": false, "sexist": false }, "id": 129, "error": false }';

async function delay(duration) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
