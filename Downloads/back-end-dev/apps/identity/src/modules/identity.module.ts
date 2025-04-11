import { Module } from '@nestjs/common';

import { EventBusModule } from '@common/modules/event-bus/event-bus.module';
import { TempTokenModule } from '@common/modules/security/temp-token/temp-token.module';

import { AccessTokenRefreshCommandHandler } from '@identity/actions/access-token-refresh.command';
import { ContactBeginConfirmationCommandHandler } from '@identity/actions/contact-begin-confirmation.command';
import { ContactFinishConfirmationCommandHandler } from '@identity/actions/contact-finish-confirmation.command';
import { LoginCommandHandler } from '@identity/actions/login.command';
import { PasswordBeginResetCommandHandler } from '@identity/actions/password-begin-reset.command';
import { PasswordFinishResetCommandHandler } from '@identity/actions/password-confirm-reset.command';
import { RegisterCommandHandler } from '@identity/actions/register.command';
import { RoleAssignCommandHandler } from '@identity/actions/role-assign.command';
import { ErrorModule } from '@identity/common/exceptions/error.module';
import { AuthenticationModule } from '@identity/modules/authentication/authentication.module';
import { RbacModule } from '@identity/modules/rbac/rbac.module';
import { SessionModule } from '@identity/modules/session/session.module';
import { UserModule } from '@identity/modules/user/user.module';

@Module({
  imports: [SessionModule, UserModule, AuthenticationModule, ErrorModule, TempTokenModule, EventBusModule, RbacModule],
  providers: [
    RegisterCommandHandler,
    LoginCommandHandler,
    AccessTokenRefreshCommandHandler,
    ContactBeginConfirmationCommandHandler,
    ContactFinishConfirmationCommandHandler,
    PasswordBeginResetCommandHandler,
    PasswordFinishResetCommandHandler,
    RoleAssignCommandHandler,
  ],
})
export class IdentityModule {}
