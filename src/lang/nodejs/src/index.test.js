const blot = require('./index.js');

describe('Falsy cases', () => {
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
