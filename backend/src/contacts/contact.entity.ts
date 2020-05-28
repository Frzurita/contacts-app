import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm'
import { User } from '../auth/user.entity'

@Unique(['email', 'userId'])
@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  lastName: string

  @Column()
  email: string

  @Column()
  phoneNumber: string

  @ManyToOne(
    type => User,
    user => user.contacts,
    { eager: false },
  )
  user: User

  @Column()
  userId: string
}
