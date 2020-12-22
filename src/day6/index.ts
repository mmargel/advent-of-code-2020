import {test, readInput} from '../utils/index';

const prepareInput = (rawInput: string) =>
  rawInput.split('\n\n').map((groupAnswers) => groupAnswers.split('\n'));

const input = prepareInput(readInput());

const getPersonalAnswers = (personalAnswers: string) => {
  return personalAnswers.split('');
};

const getUniqueGroupAnswers = (groupAnswers: string[]) => {
  return [
    ...new Set(
      groupAnswers.flatMap((personalAnswer) => personalAnswer.split('')),
    ),
  ];
};

const getCommonGroupAnswers = (groupAnswers: string[]) => {
  return [
    ...groupAnswers.slice(1).reduce((acc, personalAnswerString) => {
      // Get the array of personal answers
      const personalAnswerSet = new Set(
        getPersonalAnswers(personalAnswerString),
      );
      // Return the items that are in both sets
      return new Set([...acc].filter((item) => personalAnswerSet.has(item)));
    }, new Set(getPersonalAnswers(groupAnswers[0]))),
  ];
};

const countCommonGroupAnswers = (groupAnswers: string[]) => {
  return getCommonGroupAnswers(groupAnswers).length;
};

const countCommonFlightAnswers = (flightAnswers: string[][]) => {
  return flightAnswers.reduce(
    (acc, groupAnswers) => acc + countCommonGroupAnswers(groupAnswers),
    0,
  );
};

const countUniqueGroupAnswers = (groupAnswers: string[]) => {
  return getUniqueGroupAnswers(groupAnswers).length;
};

const countUniqueFlightAnswers = (flightAnswers: string[][]) => {
  return flightAnswers.reduce(
    (acc, groupAnswers) => acc + countUniqueGroupAnswers(groupAnswers),
    0,
  );
};

const goA = (input: string[][]) => {
  return countUniqueFlightAnswers(input);
};

const goB = (input: string[][]) => {
  return countCommonFlightAnswers(input);
};

/* Tests */

const testInput = prepareInput(readInput('testInput.txt'));
test(testInput.length, 5);
test(getPersonalAnswers('abc'), ['a', 'b', 'c']);
test(getUniqueGroupAnswers(testInput[0]), ['a', 'b', 'c']);
test(getUniqueGroupAnswers(testInput[1]), ['a', 'b', 'c']);
test(getUniqueGroupAnswers(testInput[2]), ['a', 'b', 'c']);
test(getUniqueGroupAnswers(testInput[3]), ['a']);
test(getUniqueGroupAnswers(testInput[4]), ['b']);

test(countUniqueGroupAnswers(testInput[0]), 3);
test(countUniqueGroupAnswers(testInput[1]), 3);
test(countUniqueGroupAnswers(testInput[2]), 3);
test(countUniqueGroupAnswers(testInput[3]), 1);
test(countUniqueGroupAnswers(testInput[4]), 1);

test(countUniqueFlightAnswers(testInput), 3 + 3 + 3 + 1 + 1);

test(getCommonGroupAnswers(testInput[0]), ['a', 'b', 'c']);
test(getCommonGroupAnswers(testInput[1]), []);
test(getCommonGroupAnswers(testInput[2]), ['a']);
test(getCommonGroupAnswers(testInput[3]), ['a']);
test(getCommonGroupAnswers(testInput[4]), ['b']);

test(countCommonGroupAnswers(testInput[0]), 3);
test(countCommonGroupAnswers(testInput[1]), 0);
test(countCommonGroupAnswers(testInput[2]), 1);
test(countCommonGroupAnswers(testInput[3]), 1);
test(countCommonGroupAnswers(testInput[4]), 1);

test(countCommonFlightAnswers(testInput), 3 + 0 + 1 + 1 + 1);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
