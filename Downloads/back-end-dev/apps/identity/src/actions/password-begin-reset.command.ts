import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { MIN_MS } from '@common/constants';
import { AdminPasswordForgotEvent } from '@common/modules/event-bus/events/admin.events';
import { PlayerPasswordForgotEvent } from '@common/modules/event-bus/events/player.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';
import { TempTokenService, TempTokenType } from '@common/modules/security/temp-token/temp-token.service';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { RequestExtraDto } from '@identity/modules/authentication/dto/login.dto';
import { PasswordBeginResetDto } from '@identity/modules/authentication/dto/reset-password.dto';
import { Admin } from '@identity/modules/user/entities/admin.entity';
import { UserService } from '@identity/modules/user/user.service';

export class PasswordBeginResetCommand extends PasswordBeginResetDto {
  scope: UserScope;
  extra?: Partial<RequestExtraDto>;

  constructor(data: PasswordBeginResetCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(PasswordBeginResetCommand, data));
    }
  }
}

@CommandHandler(PasswordBeginResetCommand)
export class PasswordBeginResetCommandHandler implements ICommandHandler<PasswordBeginResetCommand> {
  constructor(
    private readonly tempTokenService: TempTokenService,
    private readonly userService: UserService,
    private readonly producerService: ProducerService,
    private readonly errorService: ErrorService,
  ) {}

  @Transactional()
  async execute(command: PasswordBeginResetCommand) {
    const { scope, contact } = command;

    const token = await this.tempTokenService.createTempToken({
      contact: contact.value,
      type: TempTokenType.RESET_PASSWORD,
      ttlMs: MIN_MS * 15,
    });

    const user = await this.userService.getUserByScope(scope, contact);

    if (!user) {
      this.errorService.throw(ErrorCode.USER_NOT_FOUND, {
        field: 'identifier',
      });
    }

    if (user instanceof Admin) {
      return this.producerService.publish(
        new AdminPasswordForgotEvent({
          token,
          admin: { id: user.id },
          contact: user.mainContact,
        }),
      );
    }

    return this.producerService.publish(
      new PlayerPasswordForgotEvent({
        token,
        contact: user.mainContact,
      }),
    );
  }
}
