import { test, expect } from 'vitest';
import { testUtilsAdd } from './calc';

test('testUtilsAdd(10, 20) should return 30', () => {
  expect(testUtilsAdd(10, 20)).toBe(30);
});

