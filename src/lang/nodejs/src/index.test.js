const blot = require('./index.js');
const errors = require('./errorMessages.js');
const WebSocketClient = require('ws');
const fs = require('fs');
let ws = null;

beforeAll(() => {
  blot.setPort(3000).openManually();
  ws = new WebSocketClient('ws://localhost:3000');
});

afterAll(() => {
  ws.close();
});

describe('Falsy JSON', () => {
  test('undefined', () => {
    expect(() => blot.visualise(undefined)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Function', () => {
    expect(() => blot.visualise(() => 'hello world')).toThrow(
      errors.INVALID_JSON_ERROR
    );
  });

  test('Tests null', () => {
    expect(() => blot.visualise(null)).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Empty String', () => {
    expect(() => blot.visualise('')).toThrow(errors.INVALID_JSON_ERROR);
  });
});

describe('Invalid JSON tests', () => {
  test('Object', () => {
    expect(() =>
      blot.visualise({
        name: 'John'
      })
    ).toThrow(errors.INVALID_JSON_ERROR);
  });

  test('Array', () => {
    expect(() => blot.visualise([1, 2, 3, 4])).toThrow(
      errors.INVALID_JSON_ERROR
    );
  });

  test('Plain String', () => {
    expect(() => blot.visualise('hello world')).toThrow(
      errors.INVALID_JSON_ERROR
    );
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
    ws.onmessage = (msg) => {
      expect(msg.data).toBe('null');
      done();
    };

    blot.visualise('null');
  });

  test('Integer', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toEqual('27');
      done();
    };

    blot.visualise('27');
  });

  test('Float', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toBe('3.1415');
      done();
    };

    blot.visualise('3.1415');
  });

  test('Object', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(
        JSON.stringify({
          name: 'John'
        })
      );
      done();
    };

    blot.visualise(
      JSON.stringify({
        name: 'John'
      })
    );
  });

  test('Array', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toBe('[1,2,3,4]');
      done();
    };

    blot.visualise(JSON.stringify([1, 2, 3, 4]));
  });

  test('Big JSON file', (done) => {
    let jsonString = null;

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(jsonString);
      done();
    };

    fs.readFile('./src/bigTest.json', 'utf8', (err, data) => {
      if (err) {
        done.fail(err);
      } else {
        jsonString = data;
        blot.visualise(jsonString);
      }
    });
  });

  test('Boolean', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toBe('true');
      done();
    };

    blot.visualise('true');
  });

  test('Stringified plain string', (done) => {
    const test = '"Hello World"';
    ws.onmessage = (msg) => {
      expect(msg.data).toBe(test);
      done();
    };

    blot.visualise(test);
  });

  test('JSON text', (done) => {
    ws.onmessage = (msg) => {
      expect(msg.data).toEqual(jsonText);
      done();
    };

    blot.visualise(jsonText);
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
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 20)); // wait for a random duration up to 20ms
        blot.visualise(JSON.stringify(i));
      }
    })();
  });
});

describe('Falsy port numbers', () => {
  test('Port undefined', () => {
    expect(() => blot.setPort(undefined)).toThrow(
      errors.NON_INTEGER_PORT_ERROR
    );
  });

  test('Port null', () => {
    expect(() => blot.setPort(null)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('NaN', () => {
    expect(() => blot.setPort(NaN)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });
});

describe('Port number cases', () => {
  test('Float', () => {
    expect(() => blot.setPort(1.231)).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('Zero', () => {
    expect(() => blot.setPort(0)).toThrow(errors.INVALID_PORT_NUMBER_ERROR);
  });

  test('Negative', () => {
    expect(() => blot.setPort(-1234)).toThrow(errors.INVALID_PORT_NUMBER_ERROR);
  });

  test('Function', () => {
    expect(() => blot.setPort(() => {})).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });

  test('Object', () => {
    expect(() =>
      blot.setPort({
        name: 'John'
      })
    ).toThrow(errors.NON_INTEGER_PORT_ERROR);
  });
});

/*****
 * SAMPLE DATA
 ******/

const jsonText =
  '{ "category": "Programming", "type": "twopart", "setup": "How do you generate a random string?", "delivery": "Put a Windows user in front of Vim and tell him to exit.", "flags": { "nsfw": false, "religious": false, "political": false, "racist": false, "sexist": false }, "id": 129, "error": false }';
