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
    expect(() => blot.visualise(undefined)).toThrow(errors.invalidJSONError);
  });

  test('Function', () => {
    expect(() => blot.visualise(() => 'hello world')).toThrow(
      errors.invalidJSONError
    );
  });

  test('Tests null', () => {
    expect(() => blot.visualise(null)).toThrow(errors.invalidJSONError);
  });

  test('Empty String', () => {
    expect(() => blot.visualise('')).toThrow(errors.invalidJSONError);
  });
});

describe('Invalid JSON tests', () => {
  test('Object', () => {
    expect(() =>
      blot.visualise({
        name: 'John'
      })
    ).toThrow(errors.invalidJSONError);
  });

  test('Array', () => {
    expect(() => blot.visualise([1, 2, 3, 4])).toThrow(errors.invalidJSONError);
  });

  test('Plain String', () => {
    expect(() => blot.visualise('hello world')).toThrow(
      errors.invalidJSONError
    );
  });
});

describe('Standard JSON tests', () => {
  test('Stringified empty string', (done) => {
    const emptyString = '""';

    ws.onmessage = (msg) => {
      expect(msg.data).toBe(emptyString);
      done();
    };

    blot.visualise(emptyString);
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

  test('Multiple function calls', (done) => {
    const receivedArray1 = []; // recieves all calls immediately
    const receivedArray2 = []; // receives calls with delay

    ws.onmessage = (msg) => {
      receivedArray1.push(JSON.parse(msg.data));
    };

    let testArray = null;

    fs.readFile('./src/testArray.json', 'utf8', (err, data) => {
      if (err) {
        done.fail(err);
      } else {
        testArray = JSON.parse(data);

        testArray.forEach((jsonObj) => {
          blot.visualise(JSON.stringify(jsonObj));
        });

        /*
        setTimeout is needed so the onmessage callback doesn't change to early
        otherwise the visualise calls from the previous line will trigger the new
        onmessage callback below
        */
        setTimeout(
          /*
          send a bunch of data, separated by random time intervals of up to 10ms.
          use async to wait for the each data to be sent before sending the next
          */
          async () => {
            ws.onmessage = (msg) => {
              receivedArray2.push(JSON.parse(msg.data));
            };

            for (const jsonObj of testArray) {
              // wait a random duration of up to 10ms
              await new Promise((resolve) =>
                setTimeout(resolve, Math.random() * 10)
              );

              blot.visualise(JSON.stringify(jsonObj));
            }

            setTimeout(checkReceivedData, 2000);
          },
          1
        );
      }
    });

    function checkReceivedData() {
      if (
        receivedArray1.length !== testArray.length ||
        receivedArray2.length !== testArray.length
      ) {
          done.fail(new Error(errors.badDataTransmissionError));
      } else {
        for (let i = 0; i < testArray.length; i++) {
          expect(receivedArray1[i]).toEqual(testArray[i]);
          expect(receivedArray2[i]).toEqual(testArray[i]);
        }

        done();
      }
    }
  });
});

describe('Falsy port numbers', () => {
  test('Port undefined', () => {
    expect(() => blot.setPort(undefined)).toThrow(errors.nonIntegerPortError);
  });

  test('Port null', () => {
    expect(() => blot.setPort(null)).toThrow(errors.nonIntegerPortError);
  });

  test('NaN', () => {
    expect(() => blot.setPort(NaN)).toThrow(errors.nonIntegerPortError);
  });
});

describe('Port number cases', () => {
  test('Float', () => {
    expect(() => blot.setPort(1.231)).toThrow(errors.nonIntegerPortError);
  });

  test('Zero', () => {
    expect(() => blot.setPort(0)).toThrow(errors.invalidPortNumberError);
  });

  test('Negative', () => {
    expect(() => blot.setPort(-1234)).toThrow(errors.invalidPortNumberError);
  });

  test('Function', () => {
    expect(() => blot.setPort(() => {})).toThrow(errors.nonIntegerPortError);
  });

  test('Object', () => {
    expect(() =>
      blot.setPort({
        name: 'John'
      })
    ).toThrow(errors.nonIntegerPortError);
  });
});

/*****
 * SAMPLE DATA
 ******/

const jsonText =
  '{ "category": "Programming", "type": "twopart", "setup": "How do you generate a random string?", "delivery": "Put a Windows user in front of Vim and tell him to exit.", "flags": { "nsfw": false, "religious": false, "political": false, "racist": false, "sexist": false }, "id": 129, "error": false }';
