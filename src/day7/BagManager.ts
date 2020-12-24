interface IBag {
  colour: string;
  // TODO: can this be an array?
  children: Record<string, {bag: Bag; count: number}>;
  parents: Bag[];
}

class Bag implements IBag {
  colour: string;
  children: Record<string, {bag: Bag; count: number}> = {};
  parents: Bag[] = [];

  constructor(colour: string) {
    this.colour = colour;
  }

  toString = () => {
    return (
      `Colour: ${this.colour}\n` +
      `+ Children: ${
        Object.values(this.children)
          .map((child) => `${child.bag.colour} x ${child.count}`)
          .join(', ') || '(none)'
      }\n` +
      `+ Parents: ${
        this.parents.map((parent) => parent.colour).join(', ') || '(none)'
      }\n`
    );
  };

  getAncestors = (): Bag[] => {
    const ancestors: Bag[] = [];
    const ancestorQueue: Bag[] = [...this.parents];
    while (ancestorQueue.length > 0) {
      const currentBag = ancestorQueue.pop()!;
      ancestors.push(currentBag);
      ancestorQueue.push(...currentBag.parents);
    }

    return [...new Set(ancestors)];
  };

  countAncestors = (): number => {
    return this.getAncestors().length;
  };

  countDescendents = (): number => {
    return Object.values(this.children).reduce((acc, child) => {
      return acc + child.count + child.count * child.bag.countDescendents();
    }, 0);
  };
}

export class BagManager {
  // maps a colour to a Bag
  bagMap: Record<string, Bag> = {};

  constructor(rules: string[]) {
    rules.forEach((rule) => this.addRule(rule));
  }

  getBag = (colour: string): Bag | undefined => {
    return this.bagMap[colour];
  };

  private getOrCreateBag = (colour: string): Bag => {
    return (this.bagMap[colour] ||= new Bag(colour));
  };

  private addRule(rule: string): void {
    const [, parentColour, childrenString] =
      rule.match(/^(.*) bags contain (.*)$/) || [];

    const parentBag = this.getOrCreateBag(parentColour);
    childrenString
      .split(', ')
      .map((child) => child.replace(/ bags?.?/, ''))
      .forEach((child) => {
        const [match, childCount, childColour] =
          child.match(/(\d+) (.*)/) || [];

        if (!match) {
          return;
        }

        const childBag = this.getOrCreateBag(childColour);
        parentBag.children[childColour] = {
          bag: childBag,
          count: parseInt(childCount),
        };

        childBag.parents.push(parentBag);
      });
  }
}
