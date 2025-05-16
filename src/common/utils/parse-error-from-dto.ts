export const parseErrorMessageDTO = (error: any): string => {
  if (!error.constraints) {
    return `Unexpected error occurred with property ${error.property}; details: ${error}`;
  }

  const constraintKey = Object.keys(error.constraints)[0];
  const property = error.property;
  const constraintValue = error.constraints[constraintKey];

  // Add more cases as needed for other validation decorators (e.g. IsDate, IsPhoneNumber, etc.)
  switch (constraintKey) {
    case 'isEmail':
      return `${property} must be a valid email address`;
    case 'minLength':
      return `${property} must be longer than or equal to ${constraintValue} characters`;
    case 'maxLength':
      return `${property} must be shorter than or equal to ${constraintValue} characters`;
    case 'min':
      return `${property} must not be less than ${constraintValue}`;
    case 'isDate':
      return `${property} is not a valid date`;
    case 'isUUID':
      return `${property} is not a valid UUID`;
    case 'isEnum':
      return `Valid types for ${property} are: ${constraintValue}. Please select one of these options`;
    case 'isNotEmpty':
      return `${property} is required. Please provide a value`;
    case 'isString':
      return `${property} must be a string value`;
    case 'isNumber':
      return `${property} must be a number value`;
    case 'isBoolean':
      return `${property} must be a boolean value`;
    case 'isOptional':
      return `${property} is optional`;

    default:
      return `${property} is invalid`;
  }
};
