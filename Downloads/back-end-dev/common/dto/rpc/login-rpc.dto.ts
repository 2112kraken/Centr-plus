import { RemoteProcedureDto } from '@app/nest-dto-rpc';

import { ContactDto } from '@common/dto/contact.dto';

@RemoteProcedureDto()
export class LoginRpcDto {
  contact: ContactDto;
  password: string;
}
