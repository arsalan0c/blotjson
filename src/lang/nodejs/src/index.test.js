const blot = require('./index.js');

describe('Falsy json Strings', () => {
  test('Tests empty string', () => {
    expect(() => blot.visualise('')).toThrow('empty string cannot be used as an argument to visualise');
  });

  test('Tests null', () => {
    expect(() => blot.visualise(null)).toThrow('null cannot be used as an argument to visualise');
  });

  test('Tests undefined', () => {
    expect(() => blot.visualise(undefined)).toThrow('undefined cannot be used as an argument to visualise')
  });
});


describe('Non-string cases', () =>{
  const message = 'non-string type cannot be used as an arguement to visualise';
  test('Integer', () => {
    expect(() => blot.visualise(27)).toThrow(message);
  });

  test('Float', () => {
    expect(() => blot.visualise(3.1415)).toThrow(message);
  });

  test('Object', () => {
    expect(() => blot.visualise({name : "John"})).toThrow(message);
  });

  test('Function', () => {
    expect(() => blot.visualise(() => "hello world")).toThrow(message);
  });

  test('Boolean', () => {
    expect(() => blot.visualise(true)).toThrow(message);
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
    expect(() => blot.setPort({name : "John"})).toThrow('Port must be a valid integer');
  });
});
