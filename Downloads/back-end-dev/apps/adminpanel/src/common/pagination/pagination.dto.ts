import { InputType, Field, Int } from '@nestjs/graphql';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class OrderDto {
  @Field(() => String)
  sortBy: string;

  @Field(() => SortOrder)
  sortOrder: SortOrder;
}

@InputType()
export class PaginationDto {
  @Field(() => Int, { defaultValue: 1 })
  page: number = 1;

  @Field(() => Int, { defaultValue: 10 })
  pageSize: number = 10;
}
