import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AdminContact } from '@adminpanel/modules/user/admin/entity/admin-contact.entity';
import { Admin } from '@adminpanel/modules/user/admin/entity/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    readonly adminRepository: Repository<Admin>,

    @InjectRepository(AdminContact)
    readonly adminContactRepository: Repository<AdminContact>,
  ) {}
}
