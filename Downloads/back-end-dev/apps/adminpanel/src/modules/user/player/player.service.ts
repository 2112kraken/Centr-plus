import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PlayerContact } from '@adminpanel/modules/user/player/entity/player-contact.entity';
import { PlayerInfo } from '@adminpanel/modules/user/player/entity/player-info.entity';
import { Player } from '@adminpanel/modules/user/player/entity/player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    readonly playerRepository: Repository<Player>,

    @InjectRepository(PlayerInfo)
    readonly playerInfoRepository: Repository<PlayerInfo>,

    @InjectRepository(PlayerContact)
    readonly playerContactRepository: Repository<PlayerContact>,
  ) {}
}
