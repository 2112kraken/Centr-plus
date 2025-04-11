import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminResolver } from '@adminpanel/modules/user/admin/admin.resolver';
import { AdminService } from '@adminpanel/modules/user/admin/admin.service';
import { AdminContact } from '@adminpanel/modules/user/admin/entity/admin-contact.entity';
import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, AdminContact])],
  providers: [AdminResolver, AdminService],
})
export class AdminModule {}
