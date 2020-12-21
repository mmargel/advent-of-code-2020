import {test, readInput} from '../utils/index';

enum Terrain {
  Tree = '#',
  Snow = '.',
}

interface Velocity {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

const prepareInput = (rawInput: string) => {
  return rawInput
    .split('\n')
    .map((row) => row.split('').map((cell) => cell as Terrain));
};

const input = prepareInput(readInput());

const countTreesOnPath = (slope: Terrain[][], velocity: Velocity) => {
  let treesHit = 0;
  let position: Position = {x: 0, y: 0};
  let rowWidth = slope[0].length;
  while (position.y < slope.length) {
    if (slope[position.y][position.x] === Terrain.Tree) {
      treesHit++;
    }
    position.x = (position.x + velocity.x) % rowWidth;
    position.y += velocity.y;
  }
  return treesHit;
};

const goA = (input: Terrain[][]) => {
  return countTreesOnPath(input, {x: 3, y: 1});
};

const countCompoundedTreesOnPaths = (
  input: Terrain[][],
  velocities: Velocity[],
) => {
  return velocities.reduce(
    (acc: number, velocity: Velocity) =>
      acc * countTreesOnPath(input, velocity),
    1,
  );
};

const goB = (input: Terrain[][]) => {
  const velocities: Velocity[] = [
    {x: 1, y: 1},
    {x: 3, y: 1},
    {x: 5, y: 1},
    {x: 7, y: 1},
    {x: 1, y: 2},
  ];

  return countCompoundedTreesOnPaths(input, velocities);
};

/* Tests */

const testInput: Terrain[][] = [
  '..##.......',
  '#...#...#..',
  '.#....#..#.',
  '..#.#...#.#',
  '.#...##..#.',
  '..#.##.....',
  '.#.#.#....#',
  '.#........#',
  '#.##...#...',
  '#...##....#',
  '.#..#...#.#',
].map((row) => row.split('').map((cell) => cell as Terrain));
const testVelocities: Velocity[] = [
  {x: 1, y: 1},
  {x: 3, y: 1},
  {x: 5, y: 1},
  {x: 7, y: 1},
  {x: 1, y: 2},
];
test(countTreesOnPath(testInput, {x: 3, y: 1}), 7);
test(goA(testInput), 7);

test(countTreesOnPath(testInput, testVelocities[0]), 2);
test(countTreesOnPath(testInput, testVelocities[1]), 7);
test(countTreesOnPath(testInput, testVelocities[2]), 3);
test(countTreesOnPath(testInput, testVelocities[3]), 4);
test(countTreesOnPath(testInput, testVelocities[4]), 2);
test(countCompoundedTreesOnPaths(testInput, testVelocities), 336);
test(goB(testInput), 336);

/* Results */

console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
