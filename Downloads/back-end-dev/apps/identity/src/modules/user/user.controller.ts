import { Controller } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';

import { MessagePatternDto } from '@app/nest-dto-rpc';

import { BlockUserByIdRpcDto } from '@identity/modules/user/dto/block-user-by-id.dto';
import { GetPlayerByIdDto } from '@identity/modules/user/dto/get-player-by-id.dto';
import { UserService } from '@identity/modules/user/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePatternDto(BlockUserByIdRpcDto)
  async blockUserById(dto: BlockUserByIdRpcDto) {
    return this.userService.blockUserById(dto);
  }

  @MessagePatternDto(GetPlayerByIdDto)
  async getPlayer(@Payload() dto: GetPlayerByIdDto) {
    return this.userService.playerRepository.findOneBy({
      id: dto.playerId,
    });
  }
}
