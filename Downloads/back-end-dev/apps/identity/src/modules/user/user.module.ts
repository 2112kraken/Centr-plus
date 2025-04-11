import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminContact } from '@identity/modules/user/entities/admin-contact.entity';
import { Admin } from '@identity/modules/user/entities/admin.entity';
import { PlayerBlockInfo } from '@identity/modules/user/entities/player-block-info.entity';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { PlayerInfo } from '@identity/modules/user/entities/player-info.entity';
import { Player } from '@identity/modules/user/entities/player.entity';
import { PlayerResolver } from '@identity/modules/user/player.resolver';
import { UserController } from '@identity/modules/user/user.controller';
import { UserService } from '@identity/modules/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminContact, Player, PlayerInfo, PlayerContact, PlayerBlockInfo])],
  providers: [UserService, PlayerResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
