import { firstValueFrom } from 'rxjs';

import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { getMessagePatternFromDto } from '@app/nest-dto-rpc';

import { RpcClient } from '@common/modules/rpc/service-name.enum';
import { JwtPayload } from '@common/modules/security/jwt/token.service';

import { AssignRoleDto } from '@identity/modules/rbac/dto/assign-role.dto';
import type { Admin } from '@identity/modules/user/entities/admin.entity';

import { adminSdk } from '@supertest/common/admin-sdk';
import { generateTestAdmin } from '@supertest/common/test-helpers';
import { config } from '@supertest/config';

function getJwtPayload(token: string): JwtPayload {
  const [, payloadBase64] = token.split('.');
  const payload = Buffer.from(payloadBase64, 'base64').toString('utf-8');
  return JSON.parse(payload);
}

describe('rbac', () => {
  let identityRpcClient: ClientProxy;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ClientsModule.registerAsync({
          clients: [
            {
              name: RpcClient.IDENTITY,
              useFactory: () => ({
                transport: Transport.TCP,
                options: config.service.identity.tcp,
              }),
            },
          ],
        }),
      ],
    }).compile();

    identityRpcClient = moduleRef.get<ClientProxy>(RpcClient.IDENTITY);
  });

  afterAll(async () => {
    await identityRpcClient.close();
  });

  it.each([
    ['SUPER_ADMIN', ['PLAYER_READ', 'PLAYER_WRITE']],
    ['PLAYER_RW', ['PLAYER_READ', 'PLAYER_WRITE']],
    ['PLAYER_RO', ['PLAYER_READ']],
  ])('should asign %s role on admin', async (roleName, permissions) => {
    const testUser = generateTestAdmin();
    const response = await adminSdk.Register({ dto: testUser }, { 'x-language': 'EN' });

    const roles = await adminSdk.Roles();
    const adminRole = roles.roles.find((r) => r.name === roleName)!;
    const payload = getJwtPayload(response.register.accessToken);
    const refreshToken = `Bearer ${response.register.refreshToken}`;

    await firstValueFrom(
      identityRpcClient.send<Admin, AssignRoleDto>(getMessagePatternFromDto(AssignRoleDto), {
        userId: payload.sub,
        roleId: adminRole.id,
      }),
    );

    const { refreshAccessToken } = await adminSdk.RefreshAccessToken(undefined, { authorization: refreshToken });

    const newPayload = getJwtPayload(refreshAccessToken.accessToken);

    expect(newPayload.permissions.sort()).toStrictEqual(permissions.sort());
  });
});
