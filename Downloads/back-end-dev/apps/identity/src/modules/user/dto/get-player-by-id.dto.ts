import { RemoteProcedureDto } from '@app/nest-dto-rpc';

@RemoteProcedureDto()
export class GetPlayerByIdDto {
  playerId: string;
}
