import { Field, InputType } from '@nestjs/graphql';

import { CurrencyCode } from '@common/enum/currency.enum';

@InputType()
export class LaunchGameDto {
  @Field(() => String)
  readonly gameCode: string;

  @Field(() => CurrencyCode)
  readonly accountCurrencyCode: CurrencyCode;

  @Field(() => CurrencyCode)
  readonly gameCurrencyCode: CurrencyCode;
}
