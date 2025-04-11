import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataLoaderFactory } from '@adminpanel/common/data-loader';
import { PlayerContact } from '@adminpanel/modules/user/player/entity/player-contact.entity';
import { PlayerInfo } from '@adminpanel/modules/user/player/entity/player-info.entity';
import { Player } from '@adminpanel/modules/user/player/entity/player.entity';
import { PlayerResolver } from '@adminpanel/modules/user/player/player.resolver';
import { PlayerService } from '@adminpanel/modules/user/player/player.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, PlayerContact, PlayerInfo])],
  providers: [PlayerResolver, PlayerService, DataLoaderFactory],
  controllers: [],
})
export class PlayerModule {}
