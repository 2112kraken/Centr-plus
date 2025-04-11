import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ContactDto } from '@common/dto/contact.dto';
import { PlayerBlockedEvent } from '@common/modules/event-bus/events/player.events';
import { ProducerService } from '@common/modules/event-bus/producer.service';
import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { ErrorCode, ErrorService } from '@identity/common/exceptions/error.service';
import { SetPlayerInfoDto } from '@identity/modules/authentication/dto/set-player-info.dto';
import { BlockUserByIdRpcDto } from '@identity/modules/user/dto/block-user-by-id.dto';
import { AdminContact } from '@identity/modules/user/entities/admin-contact.entity';
import { Admin } from '@identity/modules/user/entities/admin.entity';
import { PlayerBlockInfo } from '@identity/modules/user/entities/player-block-info.entity';
import { PlayerContact } from '@identity/modules/user/entities/player-contact.entity';
import { PlayerInfo } from '@identity/modules/user/entities/player-info.entity';
import { Player } from '@identity/modules/user/entities/player.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Player)
    readonly playerRepository: Repository<Player>,

    @InjectRepository(Admin)
    readonly adminRepository: Repository<Admin>,

    @InjectRepository(PlayerInfo)
    readonly playerInfoRepository: Repository<PlayerInfo>,

    @InjectRepository(PlayerBlockInfo)
    readonly playerBlockInfoRepository: Repository<PlayerBlockInfo>,

    @InjectRepository(PlayerContact)
    readonly playerContactRepository: Repository<PlayerContact>,

    @InjectRepository(AdminContact)
    readonly adminContactRepository: Repository<AdminContact>,

    private readonly errorService: ErrorService,
    private readonly producerService: ProducerService,
  ) {}

  normalizeUsername(username: string) {
    return username.trim().replaceAll(' ', '').toLowerCase();
  }

  getUserRepository(scope: UserScope.PLAYER): Repository<Player>;
  getUserRepository(scope: UserScope.ADMIN): Repository<Admin>;
  getUserRepository(scope: UserScope): Repository<Player | Admin>;
  getUserRepository(scope: UserScope): Repository<Player | Admin> {
    switch (scope) {
      case UserScope.ADMIN:
        return this.adminRepository;

      case UserScope.PLAYER:
        return this.playerRepository;

      default:
        throw new Error(`Unsupported user scope: ${scope}`);
    }
  }

  async getUserByScope(scope: UserScope, contactDto: ContactDto, passwordHash?: string) {
    if (scope === UserScope.ADMIN) {
      const contact = await this.adminContactRepository.findOne({
        where: {
          value: contactDto.value,
          type: contactDto.type,
          isMain: true,
        },
      });

      if (!contact) {
        return null;
      }

      return this.adminRepository.findOne({
        where: {
          id: contact.adminId,
          ...(passwordHash && { passwordHash }),
        },
        relations: { contacts: true },
        select: {
          id: true,
          contacts: {
            id: true,
            isMain: true,
            type: true,
            value: true,
            verifiedAt: true,
          },
        },
      });
    }

    const contact = await this.playerContactRepository.findOne({
      where: {
        value: contactDto.value,
        type: contactDto.type,
        isMain: true,
      },
    });

    if (!contact) {
      return null;
    }

    const player = await this.playerRepository.findOne({
      where: { id: contact.playerId, ...(passwordHash && { passwordHash }) },
      relations: { contacts: true },
      select: {
        id: true,
        username: true,
        lang2: true,
        contacts: {
          id: true,
          isMain: true,
          type: true,
          value: true,
          verifiedAt: true,
        },
      },
    });

    return player;
  }

  @Transactional()
  async setPlayerInfo(id: string, infoDto: SetPlayerInfoDto): Promise<PlayerInfo> {
    const info = await this.playerInfoRepository.save(this.playerInfoRepository.create({ ...infoDto, player: { id } }));

    await this.playerRepository.update(id, { info });

    return info;
  }

  async setUserPassword(scope: UserScope, contact: ContactDto, passwordHash: string) {
    const user = await this.getUserByScope(scope, contact);

    if (!user) {
      this.errorService.throw(ErrorCode.USER_NOT_FOUND);
    }

    switch (scope) {
      case UserScope.ADMIN:
        await this.adminRepository.update(user.id, { passwordHash });
        break;

      case UserScope.PLAYER:
        await this.playerRepository.update(user.id, { passwordHash });
        break;

      default:
        this.errorService.throw(ErrorCode.SERVER_ERROR, {
          msg: 'Unexpected user scope',
          scope,
        });
    }

    return user;
  }

  async blockUserById({ userId, scope, reason }: BlockUserByIdRpcDto) {
    if (scope === UserScope.PLAYER) {
      await this.playerBlockInfoRepository.save({
        reason,
        playerId: userId,
      });
    }

    const user = await this.getUserRepository(scope).save({ id: userId, isActive: false });
    await this.producerService.publish(
      new PlayerBlockedEvent({
        playerId: userId,
        reason,
      }),
    );

    return user;
  }
}
