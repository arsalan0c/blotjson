const blot = require('./index.js');
const errors = require('./errorMessages.js');
const WebSocketClient = require('ws');
const fs = require('fs');
let ws = null;

beforeAll(() => {
  blot.setPort(3000).shouldOpenManually(true);
  ws = new WebSocketClient('ws://localhost:3000');
});

afterAll(() => {
  ws.close();
});

describe('Falsy JSON', () => {
  test('undefined', () => {
    const testData = undefined;
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Function', () => {
    const testData = () => 'hello world';
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('null', () => {
    const testData = null;
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Empty String', () => {
    const testData = '';
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('NaN', () => {
    const testData = NaN;
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });
});

describe('Invalid JSON tests', () => {
  test('Object', () => {
    const testData = {
      name: 'John'
    };
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Array', () => {
    const testData = [1, 2, 3, 4];
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Plain String', () => {
    const testData = 'hello world';
    expect(() => blot.visualise(testData)).toThrow(errors.INVALID_JSON_ERROR);
  });
});

describe('Standard JSON tests', () => {
  test('Stringified empty string', (done) => {
    const testData = '""';

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('null', (done) => {
    const testData = 'null';
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('Integer', (done) => {
    const testData = '27';
    ws.onmessage = (msg) => {
      expect(msg.data).toEqual(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('Float', (done) => {
    const testData = '3.1415';
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('Object', (done) => {
    const testData = {
      name: 'John'
    };

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(JSON.stringify(testData));
      done();
    };

    blot.visualise(JSON.stringify(testData));
  });

  test('Array', (done) => {
    const testData = '[1,2,3,4]';
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('Big JSON file', (done) => {
    let testData = null;

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    fs.readFile('./src/bigTest.json', 'utf8', (err, data) => {
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
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('Stringified plain string', (done) => {
    const testData = '"Hello World"';
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(testData);
      done();
    };

    blot.visualise(testData);
  });

  test('JSON text', (done) => {
    const testData = jsonText;
    ws.onmessage = (msg) => {
      expect(msg.data).toEqual(testData);
      done();
    };

    blot.visualise(testData);
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
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('Port null', () => {
    const testPort = null;
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('NaN', () => {
    const testPort = NaN;
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });
});

describe('Port number cases', () => {
  test('Float', () => {
    const testPort = 1.231;
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('Zero', () => {
    const testPort = 0;
    expect(() => blot.setPort(testPort)).toThrow(
      errors.INVALID_PORT_NUMBER_ERROR
    );
  });

  test('Negative', () => {
    const testPort = -1234;
    expect(() => blot.setPort(testPort)).toThrow(
      errors.INVALID_PORT_NUMBER_ERROR
    );
  });

  test('Function', () => {
    const testPort = () => {};
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('Object', () => {
    const testPort = {
      name: 'John'
    };
    expect(() => blot.setPort(testPort)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });
});

/*****
 * AUXILLIARY CONSTANTS AND FUNCTIONS
 ******/

const jsonText =
  '{ "category": "Programming", "type": "twopart", "setup": "How do you generate a random string?", "delivery": "Put a Windows user in front of Vim and tell him to exit.", "flags": { "nsfw": false, "religious": false, "political": false, "racist": false, "sexist": false }, "id": 129, "error": false }';

async function delay(duration) {
  await new Promise((resolve) => setTimeout(resolve, duration));
}
