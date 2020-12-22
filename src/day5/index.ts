import {test, readInput} from '../utils/index';

const prepareInput = (rawInput: string) => rawInput.split('\n');

const input = prepareInput(readInput());

const getRow = (code: string): number => {
  return parseInt(code.replace(/B/gi, '1').replace(/F/gi, '0'), 2);
};

const getCol = (code: string): number => {
  return parseInt(code.replace(/R/gi, '1').replace(/L/gi, '0'), 2);
};

const getId = (row: number, col: number) => {
  return row * 8 + col;
};

const getSeatId = (code: string): number => {
  const row = getRow(code.slice(0, 7));
  const col = getCol(code.slice(7, 10));
  return getId(row, col);
};

const getMaxId = (codes: string[]) => {
  return codes.reduce((acc, code) => Math.max(acc, getSeatId(code)), 0);
};

const getMinMaxId = (codes: string[]) => {
  return getMinMax(codes.map(getSeatId));
};

const getMinMax = (values: number[]) => {
  return values.reduce(
    (acc, value) => {
      return {
        min: Math.min(acc.min, value),
        max: Math.max(acc.max, value),
      };
    },
    {min: Infinity, max: 0},
  );
};

const getSumOfSeries = (min: number, max: number) => {
  return ((max + min) / 2.0) * (max - min + 1);
};

const getSumOfArray = (values: number[]) => {
  return values.reduce((acc, value) => acc + value, 0);
};

const getMissingValue = (values: number[]) => {
  const {min, max} = getMinMax(values);
  const actualTotal = getSumOfArray(values);
  const expectedTotal = getSumOfSeries(min, max);

  return expectedTotal - actualTotal;
};

const getMissingSeatId = (codes: string[]) => {
  const ids = codes.map((code) => getSeatId(code));
  return getMissingValue(ids);
};

const goA = (input: string[]) => {
  return getMaxId(input);
};

const goB = (input: string[]) => {
  return getMissingSeatId(input);
};

/* Tests */

test(getRow('BFFFBBF'), 70);
test(getRow('FFFBBBF'), 14);
test(getRow('BBFFBBF'), 102);

test(getCol('RRR'), 7);
test(getCol('RLL'), 4);

test(getId(70, 7), 567);
test(getId(14, 7), 119);
test(getId(102, 4), 820);

test(getSeatId('BFFFBBFRRR'), 567);
test(getSeatId('FFFBBBFRRR'), 119);
test(getSeatId('BBFFBBFRLL'), 820);
test(getMaxId(['BFFFBBFRRR', 'FFFBBBFRRR', 'BBFFBBFRLL']), 820);
test(getMinMaxId(['BFFFBBFRRR', 'FFFBBBFRRR', 'BBFFBBFRLL']), {
  min: 119,
  max: 820,
});

test(getSumOfSeries(2, 9), 44);
test(getSumOfSeries(1, 100), 5050);
test(getSumOfSeries(119, 820), 329589);
test(getSumOfArray([2, 3, 4, 5, 6, 7, 8, 9]), 44);
test(getMissingValue([2, 3, 5, 6, 7, 8, 9]), 4);
test(
  getMissingSeatId(['BFFFBBFRLL', 'BFFFBBFRLR', 'BFFFBBFRRR']),
  getSeatId('BFFFBBFRRL'),
);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
