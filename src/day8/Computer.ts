export class Computer {
  program: string[];
  pointer: number;
  accumulator: number;

  // this maps a line number to a "visited" flag.
  // We can use this to detect infinite loops.
  visited: Record<number, boolean> = {};

  constructor() {
    this.program = [];
    this.pointer = 0;
    this.accumulator = 0;
  }

  run(program: string[]) {
    this.initialize(program);
    while (this.pointer < this.program.length) {
      this.execute(this.pointer);
    }

    return this.accumulator;
  }

  runUntilLoopDetected(program: string[]) {
    this.initialize(program);
    while (!this.visited[this.pointer]) {
      this.execute(this.pointer);
    }

    return this.accumulator;
  }

  detectInfiniteLoop(program: string[]) {
    this.initialize(program);
    while (!this.visited[this.pointer] && this.pointer < this.program.length) {
      this.execute(this.pointer);
    }

    return this.pointer < this.program.length;
  }

  correctProgram(program: string[]) {
    let currentToggle = this.findNextToggle(program);
    let correctedProgram = this.toggleLine(program, currentToggle);
    while (this.detectInfiniteLoop(correctedProgram)) {
      currentToggle = this.findNextToggle(program, currentToggle + 1);
      correctedProgram = this.toggleLine(program, currentToggle);
    }

    return correctedProgram;
  }

  // This sets the computer to a pristine state
  private initialize(program: string[]) {
    this.program = program;
    this.pointer = 0;
    this.accumulator = 0;
    this.visited = {};
  }

  private findNextToggle(program: string[], index: number = 0) {
    // I could golf this, but I won't for readability reasons.
    while (index < program.length) {
      const instruction = program[index];
      if (instruction.match(/jmp|nop/)) {
        return index;
      }
      index++;
    }

    return -1;
  }

  private toggleLine(program: string[], line: number) {
    const newProgram = [...program];
    // This can be flattened
    newProgram[line] = newProgram[line].match(/nop/)
      ? (newProgram[line] = newProgram[line].replace(/nop/, 'jmp'))
      : (newProgram[line] = newProgram[line].replace(/jmp/, 'nop'));

    return newProgram;
  }

  private execute(line: number) {
    const instruction = this.program[line];
    const [, command, rawArg] =
      instruction.match(/(\w{3})\s((\+|\-)(\d+))/) || [];
    const arg = parseInt(rawArg);

    switch (command) {
      case 'acc':
        this.accumulator += arg;
        this.pointer++;
        break;
      case 'jmp':
        this.pointer += arg;
        break;
      case 'nop':
        this.pointer++;
        break;
    }

    this.visited[line] = true;
  }
}
