import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { ContactModule } from './contacts/contacts.module'

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
