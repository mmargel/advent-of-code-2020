import {test, readInput} from '../utils/index';

type Input = number[];

const prepareInput = (rawInput: string): Input =>
  rawInput.split('\n').map((line) => parseInt(line));

const input = prepareInput(readInput());

const hasPairWithTotal = (values: number[], total: number): boolean => {
  const totalsMap: Record<number, boolean> = {};
  const value = values.find((value) => {
    totalsMap[total - value] = true;
    return totalsMap[value];
  });

  return Boolean(value);
};

const findFirstInvalidValue = (values: number[], premable: number): number => {
  let currentIndex = premable;
  while (currentIndex <= values.length) {
    const sampleStart = currentIndex - premable;
    const sampleEnd = currentIndex;
    const sampledValues = values.slice(sampleStart, sampleEnd);

    if (!hasPairWithTotal(sampledValues, values[currentIndex])) {
      return values[currentIndex];
    }

    currentIndex++;
  }

  return -1;
};

const findRangeWithValue = (
  values: number[],
  targetValue: number,
): number[] => {
  let index = 0;
  while (index < values.length) {
    let total = 0;
    let sampleIndex = 0;
    while (total < targetValue) {
      total += values[index + sampleIndex];
      // The extra ++ on the last loop is fine because it's accounted for in the slice, below
      sampleIndex++;
    }

    if (total === targetValue) {
      return values.slice(index, index + sampleIndex);
    }

    index++;
  }

  return [];
};

const findMinMaxInRange = (values: number[]): {min: number; max: number} => {
  return values.reduce(
    (acc, value) => {
      return {
        min: Math.min(acc.min, value),
        max: Math.max(acc.max, value),
      };
    },
    {
      min: Infinity,
      max: 0,
    },
  );
};

const findEncryptionWeakness = (values: number[], preamble: number): number => {
  const invalidValue = findFirstInvalidValue(values, preamble);
  const valuesWithTotal = findRangeWithValue(values, invalidValue);
  const {min, max} = findMinMaxInRange(valuesWithTotal);
  return min + max;
};

const goA = (input: Input) => {
  return findFirstInvalidValue(input, 25);
};

const goB = (input: Input) => {
  return findEncryptionWeakness(input, 25);
};

/* Tests */

const simpleTestInput = [3, 6, 7, 10, 16, 22, 38, 60];
const simpleTestPreable = 3;

// 0
test(hasPairWithTotal(simpleTestInput.slice(0, 3), 10), true);
test(hasPairWithTotal(simpleTestInput.slice(1, 4), 16), true);
test(hasPairWithTotal(simpleTestInput.slice(2, 5), 22), false);
test(hasPairWithTotal(simpleTestInput.slice(3, 6), 38), true);
test(hasPairWithTotal(simpleTestInput.slice(4, 7), 60), true);
test(findFirstInvalidValue(simpleTestInput, simpleTestPreable), 22);

const testInput = prepareInput(readInput('testInput.txt'));
const testPreamble = 5;
const testInvalidValue = 127;
// 6
test(findFirstInvalidValue(testInput, testPreamble), testInvalidValue);
test(findRangeWithValue(testInput, 127), [15, 25, 47, 40]);
test(findMinMaxInRange([15, 25, 47, 40]), {min: 15, max: 47});
test(findEncryptionWeakness(testInput, testPreamble), 62);

// test()

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
