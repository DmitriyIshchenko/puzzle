// TODO: revert Validatable and <Omit> input value for input params
export interface Validatable {
  value: string;
  required?: boolean;
  minLength?: number;
  capitalized?: boolean;
  pattern?: {
    regexp: RegExp;
    errorMessage: string;
  };
}

export type ErrorsHandler = (message: Array<string>) => void;

export function validate(input: Validatable): Array<string> {
  const errors: Array<string> = [];
  const {
    value,
    required = false,
    capitalized = false,
    minLength = 1,
    pattern = null,
  } = input;

  if (required && value === "") {
    errors.push("This field is required.");
    return errors;
  }

  if (capitalized && (value[0] !== value[0].toUpperCase() || value[0] === "-"))
    errors.push("Should start with capital letter.");

  if (minLength && value.length < minLength)
    errors.push(`Should be at least ${minLength.toString()} characters long.`);

  if (pattern && !pattern.regexp.test(value)) errors.push(pattern.errorMessage);

  return errors;
}
