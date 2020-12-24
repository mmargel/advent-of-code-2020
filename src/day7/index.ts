import {test, readInput} from '../utils/index';
import {BagManager} from './BagManager';

type Input = string[];

const prepareInput = (rawInput: string): Input => rawInput.split('\n');

const input = prepareInput(readInput());

const goA = (input: Input) => {
  return new BagManager(input).getBag('shiny gold')?.countAncestors();
};

const goB = (input: Input) => {
  return new BagManager(input).getBag('shiny gold')?.countDescendents();
};

/* Tests */

// BagManager tests
const testInput = prepareInput(readInput('testInput1.txt'));
const bagManager = new BagManager(testInput);
const lightRed = bagManager.getBag('light red')!;
const brightWhite = bagManager.getBag('bright white')!;
const mutedYellow = bagManager.getBag('muted yellow')!;
const darkOrange = bagManager.getBag('dark orange')!;
const shinyGold = bagManager.getBag('shiny gold')!;
const fadedBlue = bagManager.getBag('faded blue')!;

test(bagManager !== undefined, true);
test(lightRed !== undefined, true);
test(lightRed?.colour, 'light red');
test(lightRed?.parents, []);
test(lightRed?.children, {
  'bright white': {bag: brightWhite, count: 1},
  'muted yellow': {bag: mutedYellow, count: 2},
});
test(brightWhite.parents, [lightRed, darkOrange]);
test(brightWhite.children, {
  'shiny gold': {bag: shinyGold, count: 1},
});
test(fadedBlue.children, {});
test(shinyGold.getAncestors(), [
  mutedYellow,
  darkOrange,
  lightRed,
  brightWhite,
]);
test(shinyGold.countAncestors(), 4);
test(shinyGold.countDescendents(), 32);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
