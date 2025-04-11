import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';

import { Account } from '@balance/modules/account/account.entity';
import { AccountService } from '@balance/modules/account/account.service';

@Resolver(() => Account)
export class AccountResolver {
  constructor(private readonly accountService: AccountService) {}

  @Query(() => Account, { nullable: true })
  async account(@Args('playerId', { nullable: true }) playerId?: string) {
    if (playerId) {
      return this.accountService.accountRepository.findOne({ where: { playerId } });
    }

    // For testing, return a mock account
    return {
      id: '1',
      playerId: '1',
      name: 'Test Account',
      currencyCode: 'USD',
      balance: '1000',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.accountService.accountRepository.findOne({ where: { id: reference.id } });
  }
}
