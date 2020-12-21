import {test, readInput} from '../utils/index';

type Passport = Record<PassportField, string>;
type Validator = (passport: Passport) => boolean;
interface PasswordFieldDetails {
  required: boolean;
  validator?: Validator;
}

enum PassportField {
  BirthYear = 'byr',
  IssueYear = 'iyr',
  ExpiryYear = 'eyr',
  Height = 'hgt',
  HairColour = 'hcl',
  EyeColour = 'ecl',
  PassportId = 'pid',
  CountryId = 'cid',
}

const validEyeColours = ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'];

const passportFields: Record<PassportField, PasswordFieldDetails> = {
  [PassportField.BirthYear]: {
    required: true,
    validator: (passport: Passport) =>
      validateBirthYear(+passport[PassportField.BirthYear]),
  },
  [PassportField.IssueYear]: {
    required: true,
    validator: (passport: Passport) =>
      validateIssueYear(+passport[PassportField.IssueYear]),
  },
  [PassportField.ExpiryYear]: {
    required: true,
    validator: (passport: Passport) =>
      validateExpirationYear(+passport[PassportField.ExpiryYear]),
  },
  [PassportField.Height]: {
    required: true,
    validator: (passport: Passport) =>
      validateHeight(passport[PassportField.Height]),
  },
  [PassportField.HairColour]: {
    required: true,
    validator: (passport: Passport) =>
      validateHairColour(passport[PassportField.HairColour]),
  },
  [PassportField.EyeColour]: {
    required: true,
    validator: (passport: Passport) =>
      validateEyeColour(passport[PassportField.EyeColour]),
  },
  [PassportField.PassportId]: {
    required: true,
    validator: (passport: Passport) =>
      validatePassportId(passport[PassportField.PassportId]),
  },
  [PassportField.CountryId]: {required: false},
};

// This takes a multi-line passport blob and returns the passport object
const parsePassportBlob = (blob: string): Passport =>
  blob.split(/\s/).reduce((acc, field) => {
    const [key, value] = field.split(':');
    return {
      ...acc,
      [key]: value,
    };
  }, {} as Record<PassportField, string>);

// The input consists of multiple passport blobs separated by \n\n
const prepareInput = (rawInput: string): Passport[] => {
  return rawInput.split('\n\n').map(parsePassportBlob);
};

const passportHasRequiredFields = (passport: Passport) => {
  return Object.keys(passportFields)
    .map((key) => key as PassportField)
    .every((field) => passport[field] || !passportFields[field]?.required);
};

const countPassportsWithRequiredFields = (passports: Passport[]) => {
  return passports.filter(passportHasRequiredFields).length;
};

const validateBirthYear = (year: number) => {
  return year >= 1920 && year <= 2002;
};

const validateIssueYear = (year: number) => {
  return year >= 2010 && year <= 2020;
};

const validateExpirationYear = (year: number) => {
  return year >= 2020 && year <= 2030;
};

const validateHeight = (height: string) => {
  const [_, size, units] = height.match(/(\d+)(\w+)/) || [];
  switch (units) {
    case 'in':
      return +size >= 59 && +size <= 76;
    case 'cm':
      return +size >= 150 && +size <= 193;
    default:
      return false;
  }
};

const validateHairColour = (colour: string) => {
  return Boolean(colour.match(/^#[a-f0-9]{6}$/i));
};

const validateEyeColour = (colour: string) => {
  return validEyeColours.includes(colour);
};

const validatePassportId = (id: string) => {
  return Boolean(id.match(/^[0-9]{9}$/));
};

const validatePassport = (passport: Passport) => {
  return Object.entries(passportFields).every(([key, field]) => {
    return (
      (passport[key as PassportField] || !field.required) &&
      (!field.validator || field.validator(passport))
    );
  });
};

const countValidPassports = (passports: Passport[]) => {
  return passports.filter(validatePassport).length;
};

const goA = (input: any) => {
  return countPassportsWithRequiredFields(input);
};

const goB = (input: any) => {
  return countValidPassports(input);
};

/* Tests */
const testInput1 = prepareInput(readInput('testInput1.txt'));
test(testInput1.length, 4);
test(passportHasRequiredFields(testInput1[0]), true);
test(passportHasRequiredFields(testInput1[1]), false);
test(passportHasRequiredFields(testInput1[2]), true);
test(passportHasRequiredFields(testInput1[3]), false);
test(countPassportsWithRequiredFields(testInput1), 2);

const testInput2Valid = prepareInput(readInput('testInput2Valid.txt'));
const testInput2Invalid = prepareInput(readInput('testInput2Invalid.txt'));
test(validateBirthYear(2000), true);
test(validateBirthYear(2010), false);
test(validateIssueYear(2010), true);
test(validateIssueYear(2030), false);
test(validateExpirationYear(2025), true);
test(validateExpirationYear(2035), false);
test(validateHeight('60in'), true);
test(validateHeight('190cm'), true);
test(validateHeight('190in'), false);
test(validateHeight('190'), false);
test(validateHairColour('#123abc'), true);
test(validateHairColour('#123abz'), false);
test(validateHairColour('123abc'), false);
test(validateEyeColour('brn'), true);
test(validateEyeColour('wat'), false);
test(validatePassportId('000000001'), true);
test(validatePassportId('200000001'), true);
test(validatePassportId('1200000001'), false);
test(validatePassportId('12000001'), false);

test(validatePassport(testInput2Valid[0]), true);
test(validatePassport(testInput2Valid[1]), true);
test(validatePassport(testInput2Valid[2]), true);
test(validatePassport(testInput2Valid[3]), true);
test(countValidPassports(testInput2Valid), 4);

test(validatePassport(testInput2Invalid[0]), false);
test(validatePassport(testInput2Invalid[1]), false);
test(validatePassport(testInput2Invalid[2]), false);
test(validatePassport(testInput2Invalid[3]), false);
test(countValidPassports(testInput2Invalid), 0);

/* Results */

const input = prepareInput(readInput());
console.time('Time');
const resultA = goA(input);
const resultB = goB(input);
console.timeEnd('Time');

console.log('Solution to part 1:', resultA);
console.log('Solution to part 2:', resultB);
