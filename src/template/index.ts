import {test, readInput} from '../utils/index';

type Input = never;

const prepareInput = (rawInput: string): Input => rawInput;

const input = prepareInput(readInput());

const goA = (input: Input) => {
  return;
};

const goB = (input: Input) => {
  return;
};

/* Tests */

// test()

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
