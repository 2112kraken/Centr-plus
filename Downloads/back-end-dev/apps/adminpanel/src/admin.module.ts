import { Module } from '@nestjs/common';

import { AuthenticationModule } from '@adminpanel/modules/authentication/authentication.module';
import { RbacModule } from '@adminpanel/modules/rbac/rbac.module';
import { SessionModule } from '@adminpanel/modules/session/session.module';
import { AdminModule } from '@adminpanel/modules/user/admin/admin.module';
import { PlayerModule } from '@adminpanel/modules/user/player/player.module';

@Module({
  imports: [AuthenticationModule, PlayerModule, AdminModule, SessionModule, RbacModule],
})
export class AdminpanelModule {}
