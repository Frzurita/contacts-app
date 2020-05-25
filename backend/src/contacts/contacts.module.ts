import { Module } from '@nestjs/common'
import { ContactsController } from './contacts.controller'
import { ContactsService } from './contacts.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ContactsRepository } from './contacts.repository'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([ContactsRepository]), AuthModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactModule {}
