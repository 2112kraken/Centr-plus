import { plainToInstance } from 'class-transformer';

import { EventDto } from '@app/nest-dto-rpc/decorators';

import { TempToken } from '@common/modules/security/temp-token/temp-token.service';

import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { Player } from '@identity/modules/user/entities/player.entity';

import { TempTokenResponseDto } from '@supertest/common/sdk/operations.graphql';

@EventDto('player.registered')
export class PlayerRegisteredEvent {
  player: Pick<Player, 'id'>;
  contact: Pick<PlayerContact, 'id' | 'type' | 'value'>;
}

@EventDto('player.blocked')
export class PlayerBlockedEvent {
  playerId: string;
  reason: string;

  constructor(data: PlayerBlockedEvent) {
    if (data) {
      Object.assign(this, plainToInstance(PlayerBlockedEvent, data));
    }
  }
}

@EventDto('player.password.forgot')
export class PlayerPasswordForgotEvent {
  contact: Pick<PlayerContact, 'id' | 'playerId' | 'type' | 'value'>;
  token: TempToken;

  constructor(data: PlayerPasswordForgotEvent) {
    if (!data) {
      return;
    }

    Object.assign(this, plainToInstance(PlayerPasswordForgotEvent, data));
  }
}

@EventDto('player.password.changed')
export class PlayerPasswordChangedEvent {
  contact: Pick<PlayerContact, 'id' | 'playerId' | 'type' | 'value'>;

  constructor(data: PlayerPasswordChangedEvent) {
    if (!data) {
      return;
    }

    Object.assign(this, plainToInstance(PlayerPasswordChangedEvent, data));
  }
}

@EventDto('player.contact.verification.started')
export class ContactVerificationStartedEvent {
  contact: PlayerContact;
  token: TempTokenResponseDto;

  constructor(data: ContactVerificationStartedEvent) {
    if (data) {
      Object.assign(this, plainToInstance(ContactVerificationStartedEvent, data));
    }
  }
}

@EventDto('player.contact.verification.success')
export class ContactVerificationSuccessEvent {
  contact: PlayerContact;

  constructor(data: ContactVerificationSuccessEvent) {
    if (data) {
      Object.assign(this, plainToInstance(ContactVerificationSuccessEvent, data));
    }
  }
}
