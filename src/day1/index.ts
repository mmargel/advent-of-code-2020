import {test, readInput} from '../utils/index';

const prepareInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => +line);

const input = prepareInput(readInput());

const getPairWithTotal = (
  values: number[],
  total: number,
): [number, number] | undefined => {
  const totalsMap: Record<number, boolean> = {};
  const value = values.find((value) => {
    totalsMap[total - value] = true;
    return totalsMap[value];
  });
  return value ? [value, total - value] : undefined;
};

const getTripletWithTotal = (
  values: number[],
  total: number,
): [number, number, number] | undefined => {
  let latestMatch: [number, number] = [0, 0];
  const value = values.find((value) => {
    const match = getPairWithTotal(values, total - value);
    latestMatch = match ?? latestMatch;
    return match;
  });

  return value ? [value, ...latestMatch] : undefined;
};

const goA = (input: number[]) => {
  const [first, second] = getPairWithTotal(input, 2020) || [];
  if (first && second) {
    return first * second;
  } else {
    return undefined;
  }
};

const goB = (input: number[]) => {
  const [first, second, third] = getTripletWithTotal(input, 2020) || [];
  if (first && second && third) {
    return first * second * third;
  } else {
    return undefined;
  }
};

/* Tests */

const testInput = [1721, 979, 366, 299, 675, 1456];
test(getPairWithTotal([1721, 979, 366, 299, 675, 1456], 2020), [1721, 299]);
test(goA(testInput), 1721 * 299);
test(getTripletWithTotal([1721, 979, 366, 299, 675, 1456], 100), [
  979,
  366,
  675,
]);
test(goB(testInput), 979 * 366 * 675);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
