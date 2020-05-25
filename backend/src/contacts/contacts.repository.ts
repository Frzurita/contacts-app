import { Contact } from './contact.entity'
import { EntityRepository, Repository } from 'typeorm'
import { CreateUpdateContactDto } from './dto/create-update-contact.dto'
import { GetContactsFilterDto } from './dto/get-contact-filter.dto'
import { User } from '../auth/user.entity'
import {
  Logger,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'

@EntityRepository(Contact)
export class ContactsRepository extends Repository<Contact> {
  private logger = new Logger('ContactsRepository')

  async getContacts(
    filterDto: GetContactsFilterDto,
    user: User,
  ): Promise<Contact[]> {
    const { search } = filterDto
    const query = this.createQueryBuilder('contact')

    query.where('contact.userId = :userId', { userId: user.id })

    if (search) {
      query.andWhere(
        '(contact.name LIKE :search OR contact.lastName LIKE :search OR contact.email LIKE :search OR contact.phoneNumber LIKE :search)',
        { search: `%${search}%` },
      )
    }

    try {
      const contacts = await query.getMany()
      return contacts
    } catch (error) {
      this.logger.error(
        `Failed to get contacts for user "${
          user.username
        }". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      )
      throw new InternalServerErrorException()
    }
  }

  async createContact(
    createContactDto: CreateUpdateContactDto,
    user: User,
  ): Promise<Contact> {
    try {
      const { name, lastName, email, phoneNumber } = createContactDto

      const contact = this.create()
      contact.name = name
      contact.lastName = lastName
      contact.email = email
      contact.phoneNumber = phoneNumber
      contact.user = user

      await contact.save()
      delete contact.user
      return contact
    } catch (error) {
      this.logger.error(
        `Failed to create a contact for user "${user.username}". Data: ${createContactDto}`,
        error.stack,
      )
      if (error.code === '23505') {
        throw new BadRequestException({
          error: 'Duplicate entry',
          message: 'Email already exists',
          statusCode: 400,
        })
      } else {
        throw new InternalServerErrorException()
      }
    }
  }

  async getContactById(id: string, user: User): Promise<Contact> {
    const found = await this.findOne({
      where: { id, userId: user.id },
    })

    if (!found) {
      throw new NotFoundException(`Contact with ID "${id}" not found`)
    }

    return found
  }

  async updateContact(
    id: string,
    updateContactDto: CreateUpdateContactDto,
    user: User,
  ): Promise<Contact> {
    try {
      const contact = await this.getContactById(id, user)
      const { name, lastName, email, phoneNumber } = updateContactDto
      contact.name = name
      contact.lastName = lastName
      contact.email = email
      contact.phoneNumber = phoneNumber

      await contact.save()
      console.log(contact)
      return contact
    } catch (error) {
      this.logger.error(
        `Failed to create a contact for user "${user.username}". Data: ${updateContactDto}`,
        error.stack,
      )
      throw new InternalServerErrorException()
    }
  }
}
