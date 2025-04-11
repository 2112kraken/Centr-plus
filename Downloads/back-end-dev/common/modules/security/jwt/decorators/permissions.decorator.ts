import { SetMetadata } from '@nestjs/common';

import { PermissionName } from '@common/enum/permission-name.enum';
import { ACCESS_TOKEN_REQUIRED } from '@common/modules/security/jwt/decorators/user-id.decorator';

export const PERMISSIONS_REQUIRED = Symbol('PERMISSION_REQUIRED');

type MethodDecorator = (target: object, key: string | symbol, descriptor: PropertyDescriptor) => PropertyDescriptor;

type ClassDecorator = (target: new (...args: any[]) => any) => void;

export const PermissionsRequired = (permissions: PermissionName[]): MethodDecorator & ClassDecorator => {
  return (target: object | (new (...args: any[]) => any), key?: string | symbol, descriptor?: PropertyDescriptor) => {
    if (key !== undefined && descriptor) {
      SetMetadata(ACCESS_TOKEN_REQUIRED, true)(target, key, descriptor);
      SetMetadata(PERMISSIONS_REQUIRED, permissions)(target, key, descriptor);
      return descriptor;
    }

    return descriptor || {};
  };
};
