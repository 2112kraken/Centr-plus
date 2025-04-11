import { Field, ObjectType, OmitType } from '@nestjs/graphql';

import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';

@ObjectType()
class AdminItem extends OmitType(Admin, ['roles', 'sessions', 'contacts'], ObjectType) {}

@ObjectType()
export class AdminsResponseDto {
  @Field(() => [AdminItem])
  data: AdminItem[];

  @Field()
  total: number;
}
