import {test, readInput} from '../utils/index';

const prepareInput = (rawInput: string) => rawInput.split('\n');

const input = prepareInput(readInput());

type Validator = (_arg: string) => boolean;

const passwordHasValidCharacterCount = (passwordAndRule: string): boolean => {
  const [rule, password] = passwordAndRule.split(': ');
  const [range, letter] = rule.split(' ');
  const [min, max] = range.split('-').map((value) => +value);

  const matchingLetterCount = password
    .split('')
    .filter((passwordLetter) => passwordLetter === letter).length;

  return min <= matchingLetterCount && matchingLetterCount <= max;
};

const passwordHasValidCharacterPosition = (
  passwordAndRule: string,
): boolean => {
  const [rule, password] = passwordAndRule.split(': ');
  const [range, letter] = rule.split(' ');
  // -1 since the rule is 1-indexed and not 0-indexed
  const [first, second] = range.split('-').map((value) => +value - 1);

  return (password[first] === letter) !== (password[second] === letter);
};

const countValidPasswords = (
  validator: Validator,
  passwordAndRuleList: string[],
): number => {
  return passwordAndRuleList.filter(validator).length;
};

const goA = (input: string[]) => {
  return countValidPasswords(passwordHasValidCharacterCount, input);
};

const goB = (input: any) => {
  return countValidPasswords(passwordHasValidCharacterPosition, input);
};

/* Tests */

const testInput = ['1-3 a: abcde', '1-3 b: cdefg', '2-9 c: ccccccccc'];
test(passwordHasValidCharacterCount(testInput[0]), true);
test(passwordHasValidCharacterCount(testInput[1]), false);
test(passwordHasValidCharacterCount(testInput[2]), true);
test(countValidPasswords(passwordHasValidCharacterCount, testInput), 2);
test(goA(testInput), 2);

test(passwordHasValidCharacterPosition(testInput[0]), true);
test(passwordHasValidCharacterPosition(testInput[1]), false);
test(passwordHasValidCharacterPosition(testInput[2]), false);
test(countValidPasswords(passwordHasValidCharacterPosition, testInput), 1);
test(goB(testInput), 1);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
