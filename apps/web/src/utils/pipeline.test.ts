import { beforeEach, describe, expect, test } from 'bun:test';

import { pipeline } from './pipeline';

type NumberTransform = (n: number) => number;

describe('src/utils/pipeline.ts', () => {
  let double: NumberTransform;
  let square: NumberTransform;
  let subtract_ten: NumberTransform;

  beforeEach(() => {
    double = (num: number) => num * 2;
    square = (num: number) => num * num;
    subtract_ten = (num: number) => num - 10;
  });

  test('It passes an input through a pipeline to produce an output', () => {
    const input = 4;
    const expected_output = 22;
    const output = pipeline(square, double, subtract_ten)(input);
    expect(output).toBe(expected_output);
  });
});
