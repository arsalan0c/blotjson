const blot = require('./index.js');
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
    expect(() => blot.visualise(undefined)).toThrow('Visualise must take in a valid JSON value')
  });

  test('Function', () => {
    expect(() => blot.visualise(() => "hello world")).toThrow('Visualise must take in a valid JSON value');
  });

  test('Tests null', () => {
    expect(() => blot.visualise(null)).toThrow('Visualise must take in a valid JSON value');
  });
});

describe('Invalid JSON tests', () => {

  test('Object', () => {
    expect(() => blot.visualise({
      name: 'John'
    })).toThrow('Visualise must take in a valid JSON value');
  });

  test('Array', () => {
    expect(() => blot.visualise([1, 2, 3, 4])).toThrow('Visualise must take in a valid JSON value');
  });

});

describe('Standard JSON tests', () => {

  test('Tests empty string', (done) => {
    const emptyString = '';

    ws.onmessage = msg => {
      expect(msg.data).toBe(emptyString);
      done();
    };

    blot.visualise(emptyString);
  });

  test('Tests null', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toBe('null');
      done();
    };

    blot.visualise('null');
  });

  test('Integer', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toEqual('27');
      done();
    };

    blot.visualise('27');
  });

  test('Float', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toBe('3.1415');
      done();
    };

    blot.visualise('3.1415');
  });

  test('Object', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toBe(JSON.stringify({
        name: 'John'
      }));
      done();
    };

    blot.visualise(JSON.stringify({
      name: 'John'
    }));

  });

  test('Array', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toBe('[1,2,3,4]');
      done();
    };

    blot.visualise(JSON.stringify([1, 2, 3, 4]));
  });

  test('Big JSON file', (done) => {

    let jsonString = null;

    ws.onmessage = msg => {
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

    ws.onmessage = msg => {
      expect(msg.data).toBe('true');
      done();
    };

    blot.visualise('true');
  });

  test('Plain string', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toBe('Hello World');
      done();
    };

    blot.visualise('Hello World');

  });

  test('JSON text', (done) => {

    ws.onmessage = msg => {
      expect(msg.data).toEqual(jsonText);
      done();
    };

    blot.visualise(jsonText);
  });

  test('Multiple function calls', (done) => {

    let receivedArray = [];

    ws.onmessage = msg => {
      receivedArray.push(JSON.parse(msg.data));
    };

    let testArray = null;

    fs.readFile('./src/testArray.json', 'utf8', (err, data) => {
      if (err) {
        done.fail(err);
      } else {
        testArray = JSON.parse(data);

        /*
        send a bunch of data, separated by random time intervals of up to 10ms.
        use async to wait for the each data to be sent before sending the next
        */
        (async () => {

          for (const jsonObj of testArray) {
            await new Promise(done => setTimeout(done, Math.random() * 10));
            blot.visualise(JSON.stringify(jsonObj));
          }

          setTimeout(checkReceivedData, 2000);
        })();
      }
    });

    function checkReceivedData() {
      if (receivedArray.length !== testArray.length) {
        setTimeout(() => done.fail(new Error('Data was not properly received by client')), 1000);
      } else {
        for (let i = 0; i < testArray.length; i++) {
          expect(testArray[i]).toEqual(receivedArray[i]);
        }

        done();
      }
    }


  });
});


describe('Falsy port numbers', () => {

  test('Port undefined', () => {
    expect(() => blot.setPort(undefined)).toThrow('Port must be a valid integer');
  });

  test('Port null', () => {
    expect(() => blot.setPort(null)).toThrow('Port must be a valid integer');
  });

  test('NaN', () => {
    expect(() => blot.setPort(NaN)).toThrow('Port must be a valid integer');
  })
});

describe('Port number cases', () => {
  test('Float', () => {
    expect(() => blot.setPort(1.231)).toThrow('Port must be a valid integer');
  });

  test('Zero', () => {
    expect(() => blot.setPort(0)).toThrow('Invalid port number');
  });

  test('Negative', () => {
    expect(() => blot.setPort(-1234)).toThrow('Invalid port number');
  });

  test('Function', () => {
    expect(() => blot.setPort(() => {})).toThrow('Port must be a valid integer');
  });

  test('Object', () => {
    expect(() => blot.setPort({
      name: "John"
    })).toThrow('Port must be a valid integer');
  });
});


/*****
 * SAMPLE DATA
 ******/

const jsonText = '{ "category": "Programming", "type": "twopart", "setup": "How do you generate a random string?", "delivery": "Put a Windows user in front of Vim and tell him to exit.", "flags": { "nsfw": false, "religious": false, "political": false, "racist": false, "sexist": false }, "id": 129, "error": false }';
