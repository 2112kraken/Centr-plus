import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MIN_MS } from '@common/constants';
import { ContactVerificationStartedEvent } from '@common/modules/event-bus/events/player.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { TempTokenResponseDto } from '@common/modules/security/temp-token/dto/temp-token.dto';
import { TempTokenService, TempTokenType } from '@common/modules/security/temp-token/temp-token.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { ContactBeginConfirmationDto } from '@identity/modules/authentication/dto/contact-confirm.dto';
import { RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { UserService } from '@identity/modules/user/user.service';

export class ContactBeginConfirmationCommand extends ContactBeginConfirmationDto {
  playerId: string;
  extra?: Partial<RequestExtraDto>;

  constructor(data: ContactBeginConfirmationCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(ContactBeginConfirmationCommand, data));
    }
  }
}

@CommandHandler(ContactBeginConfirmationCommand)
export class ContactBeginConfirmationCommandHandler
  implements ICommandHandler<ContactBeginConfirmationCommand, TempTokenResponseDto>
{
  constructor(
    private readonly tempTokenService: TempTokenService,
    private readonly userService: UserService,
    private readonly producerService: ProducerService,
    private readonly errorService: ErrorService,
  ) {}

  @Transactional()
  async execute(command: ContactBeginConfirmationCommand) {
    const contact = await this.userService.playerContactRepository.findOne({
      where: {
        playerId: command.playerId,
        id: command.contact.id,
      },
    });

    if (!contact) {
      this.errorService.throw(ErrorCode.CONTACT_NOT_FOUND);
    }

    if (contact.verifiedAt) {
      this.errorService.throw(ErrorCode.CONTACT_ALREADY_VERIFIED);
    }

    const token = await this.tempTokenService.createTempToken({
      type: TempTokenType.CONFIRM_CONTACT,
      identifier: command.playerId,
      contact: contact.value,
      ttlMs: MIN_MS * 15,
    });

    await this.producerService.publish(
      new ContactVerificationStartedEvent({
        contact,
        token,
      }),
    );

    return token;
  }
}
