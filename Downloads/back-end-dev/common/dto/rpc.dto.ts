import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { ContactDto } from '@common/dto/contact.dto';

@RemoteProcedureDto()
export class RefreshAccessTokenRpcDto {
  refreshToken: string;
}

@RemoteProcedureDto()
export class RegisterRpcDto {
  password: string;
  contact: ContactDto;
}
