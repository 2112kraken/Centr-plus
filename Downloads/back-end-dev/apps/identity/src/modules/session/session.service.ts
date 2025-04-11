import { createHash } from 'node:crypto';
import { FindOptionsRelations, MoreThanOrEqual, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserScope } from '@common/modules/security/jwt/enum/user-scope.enum';

import { Session } from '@identity/modules/session/session.entity';
import { Admin } from '@identity/modules/user/entities/admin.entity';
import { Player } from '@identity/modules/user/entities/player.entity';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    readonly sessionRepository: Repository<Session>,
  ) {}

  async findActiveSession(sessionId: string, scope: UserScope, relations?: FindOptionsRelations<Session>) {
    const session = await this.sessionRepository.findOne({
      relations: {
        ...relations,
        [scope.toLowerCase()]: true,
      },
      where: {
        sessionId,
        isActive: true,
        expiresAt: MoreThanOrEqual(new Date()),
      },
    });

    return {
      session,
      user: session?.[scope.toLowerCase() as keyof Pick<Session, 'player' | 'admin'>],
    };
  }

  async closeAllSessions(scope: UserScope, userId: string): Promise<void> {
    await this.sessionRepository.update(
      scope === UserScope.ADMIN ? { adminId: userId, isActive: true } : { playerId: userId, isActive: true },
      { isActive: false },
    );
  }

  async createSession(scope: UserScope, user: Player | Admin, sessionData: Pick<Session, 'userAgent' | 'expiresAt'>) {
    const dataToHash = [scope, user.id, sessionData.userAgent].filter(Boolean).join();

    const sessionHash = createHash('md5').update(dataToHash).digest('hex');

    return this.sessionRepository.save(
      this.sessionRepository.create({
        ...sessionData,
        sessionHash,
        [scope.toLowerCase()]: { id: user.id },
      }),
    );
  }
}
