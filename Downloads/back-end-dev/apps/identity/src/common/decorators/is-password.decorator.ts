import { IsString, IsStrongPassword, ValidationOptions } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { applyDecorators } from '@nestjs/common';

export function IsPassword(validationOptions?: ValidationOptions): PropertyDecorator {
  return applyDecorators(
    IsString(),
    IsStrongPassword(
      {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
      },
      {
        ...validationOptions,
        message: i18nValidationMessage('validation.password.strong'),
      },
    ),
  );
}
