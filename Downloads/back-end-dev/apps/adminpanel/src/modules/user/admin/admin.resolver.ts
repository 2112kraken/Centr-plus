import { Args, Query, Resolver } from '@nestjs/graphql';

import { AdminService } from '@adminpanel/modules/user/admin/admin.service';
import { AdminsResponseDto } from '@adminpanel/modules/user/admin/dto/get-damins.dto';
import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';

@Resolver(() => Admin)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => Admin, { nullable: true })
  async admin(@Args('id') id: string) {
    const admin = await this.adminService.adminRepository.findOne({
      where: { id },
      relations: { roles: true },
    });

    return admin;
  }

  @Query(() => AdminsResponseDto)
  async admins() {
    const [data, total] = await this.adminService.adminRepository.findAndCount();

    return {
      total,
      data,
    };
  }
}
