import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 12, b: 13, action: Action.Add });
    expect(result).toBe(25);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 15, b: 13, action: Action.Subtract });
    expect(result).toBe(2);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 4, b: 7, action: Action.Multiply });
    expect(result).toBe(28);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 14, b: 2, action: Action.Divide });
    expect(result).toBe(7);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 2,
      b: 3,
      action: Action.Exponentiate,
    });
    expect(result).toBe(8);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 2, b: 3, action: '?' });
    expect(result).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    const result = simpleCalculator({
      a: '2',
      b: '3',
      action: Action.Exponentiate,
    });
    expect(result).toBeNull();
  });
});
