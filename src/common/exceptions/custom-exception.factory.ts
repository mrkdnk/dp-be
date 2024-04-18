import { BadRequestException, ValidationError } from '@nestjs/common';

export const customExceptionFactory = (errors: ValidationError[]) => {
  const data = errors.map((error) => formatValidationError(error));

  return new BadRequestException(data, 'Validation error');
};

const formatValidationError = (error: ValidationError) => {
  return {
    property: error.property,
    value: error.value,
    constrains: error.constraints,
  };
};
