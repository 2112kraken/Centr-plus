import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Payload } from '@nestjs/microservices';

import { MessagePatternDto } from '@app/nest-dto-rpc';

import { RoleAssignCommand } from '@identity/actions/role-assign.command';

import { AssignRoleDto, AssignRoleResponseDto } from './dto/assign-role.dto';

@Controller()
export class RbacController {
  constructor(private readonly commandBus: CommandBus) {}

  @MessagePatternDto(AssignRoleDto)
  async assignRole(@Payload() dto: AssignRoleDto) {
    return this.commandBus.execute<RoleAssignCommand, AssignRoleResponseDto>(new RoleAssignCommand(dto));
  }
}
