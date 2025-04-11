import { plainToInstance } from 'class-transformer';

import { EventDto } from '@app/nest-dto-rpc/decorators';

import { TempToken } from '@common/modules/security/temp-token/temp-token.service';

import { AdminContact } from '@identity/modules/user/entities/admin-contact.entity';

@EventDto('admin.password.forgot')
export class AdminPasswordForgotEvent {
  admin: { id: string };
  contact: Pick<AdminContact, 'type' | 'value'>;
  token: TempToken;

  constructor(data: AdminPasswordForgotEvent) {
    if (!data) {
      return;
    }

    Object.assign(this, plainToInstance(AdminPasswordForgotEvent, data));
  }
}

@EventDto('admin.password.changed')
export class AdminPasswordChangedEvent {
  admin: { id: string };
  contact: Pick<AdminContact, 'type' | 'value'>;

  constructor(data: AdminPasswordChangedEvent) {
    if (!data) {
      return;
    }

    Object.assign(this, plainToInstance(AdminPasswordChangedEvent, data));
  }
}
