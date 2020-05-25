import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Contact } from '../contacts/contact.entity'

@Entity()
@Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  username: string

  @Column()
  password: string

  @Column()
  salt: string

  @OneToMany(
    type => Contact,
    contact => contact.user,
    { eager: true },
  )
  contacts: Contact[]

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    // return bcrypt.compareSync(this.password, hash)
    return hash === this.password
  }
}
