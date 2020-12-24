import {test, readInput} from '../utils/index';
import {Computer} from './Computer';

type Input = string[];

const prepareInput = (rawInput: string): Input => rawInput.split('\n');

const input = prepareInput(readInput());

const goA = (input: Input) => {
  const computer = new Computer();
  return computer.runUntilLoopDetected(input);
};

const goB = (input: Input) => {
  const computer = new Computer();
  const correctedProgram = computer.correctProgram(input);
  return computer.run(correctedProgram);
};

/* Tests */

const testInput = prepareInput(readInput('testInput.txt'));
const computer = new Computer();
test(computer.detectInfiniteLoop(testInput), true);
test(computer.runUntilLoopDetected(testInput), 5);

const correctedInput = computer.correctProgram(testInput);
test(computer.run(correctedInput), 8);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
