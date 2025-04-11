import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ContactVerificationSuccessEvent } from '@common/modules/event-bus/events/player.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { TempTokenService, TempTokenType } from '@common/modules/security/temp-token/temp-token.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { ContactFinishConfirmationDto } from '@identity/modules/authentication/dto/contact-confirm.dto';
import { RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { UserService } from '@identity/modules/user/user.service';

export class ContactFinishConfirmationCommand extends ContactFinishConfirmationDto {
  playerId: string;
  extra?: Partial<RequestExtraDto>;

  constructor(data: ContactFinishConfirmationCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(ContactFinishConfirmationCommand, data));
    }
  }
}

@CommandHandler(ContactFinishConfirmationCommand)
export class ContactFinishConfirmationCommandHandler
  implements ICommandHandler<ContactFinishConfirmationCommand, PlayerContact>
{
  constructor(
    private readonly tempTokenService: TempTokenService,
    private readonly userService: UserService,
    private readonly producerService: ProducerService,
    private readonly errorService: ErrorService,
  ) {}

  @Transactional()
  async execute(command: ContactFinishConfirmationCommand) {
    const { token, playerId } = command;

    const contact = await this.userService.playerContactRepository.findOne({
      where: { id: command.contact.id },
      select: ['id', 'value', 'isMain', 'type', 'verifiedAt'],
    });

    if (!contact) {
      this.errorService.throw(ErrorCode.CONTACT_NOT_FOUND);
    }

    if (contact.verifiedAt) {
      return contact;
    }

    const isTokenValid = await this.tempTokenService.verifyTempToken(token, {
      contact: contact.value,
      identifier: playerId,
      type: TempTokenType.CONFIRM_CONTACT,
    });

    if (!isTokenValid) {
      this.errorService.throw(ErrorCode.INVALID_TOKEN, { field: 'token' });
    }

    return this.userService.playerContactRepository
      .save({ ...contact, verifiedAt: new Date() })
      .then(async (contact) => {
        await this.producerService.publish(
          new ContactVerificationSuccessEvent({
            contact,
          }),
        );

        return contact;
      });
  }
}
