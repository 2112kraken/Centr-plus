import { plainToInstance } from 'class-transformer';
import { Transactional } from 'typeorm-transactional';

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TtLogger } from '@app/logger';

import { AssignRoleDto } from '@identity/modules/rbac/dto/assign-role.dto';
import { RbacService } from '@identity/modules/rbac/rbac.service';
import { UserService } from '@identity/modules/user/user.service';

export class RoleAssignCommand extends AssignRoleDto {
  constructor(data: RoleAssignCommand) {
    super();

    if (data) {
      Object.assign(this, plainToInstance(RoleAssignCommand, data));
    }
  }
}

@CommandHandler(RoleAssignCommand)
export class RoleAssignCommandHandler implements ICommandHandler<RoleAssignCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly rbacService: RbacService,
    private readonly logger: TtLogger,
  ) {}

  @Transactional()
  async execute(command: RoleAssignCommand) {
    const role = await this.rbacService.roleRepository.findOneOrFail({
      where: { id: command.roleId },
    });

    const userRepository = this.userService.getUserRepository(role.scope);

    const user = await userRepository.findOneOrFail({
      where: { id: command.userId },
      select: { id: true, roles: true },
      relations: { roles: true },
    });

    this.logger.debug({
      msg: 'Assigning role to user',
      data: { command, role, user },
    });

    if (!user.roles?.find((existing) => existing.id === role.id)) {
      user.roles?.push(role);
      return userRepository.save(user);
    }

    return user;
  }
}
