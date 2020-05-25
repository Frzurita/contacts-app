import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateUpdateContactDto } from './dto/create-update-contact.dto'
import { GetContactsFilterDto } from './dto/get-contact-filter.dto'
import { ContactsRepository } from './contacts.repository'
import { InjectRepository } from '@nestjs/typeorm'
import { Contact } from './contact.entity'
import { User } from '../auth/user.entity'

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactsRepository)
    private contactRepository: ContactsRepository,
  ) {}

  async getContacts(
    filterDto: GetContactsFilterDto,
    user: User,
  ): Promise<Contact[]> {
    return this.contactRepository.getContacts(filterDto, user)
  }

  async getContactById(id: string, user: User): Promise<Contact> {
    const found = await this.contactRepository.findOne({
      where: { id, userId: user.id },
    })

    if (!found) {
      throw new NotFoundException(`Contact with ID "${id}" not found`)
    }

    return found
  }

  async createContact(
    createContactDto: CreateUpdateContactDto,
    user: User,
  ): Promise<Contact> {
    return this.contactRepository.createContact(createContactDto, user)
  }

  async deleteContact(id: string, user: User): Promise<void> {
    const result = await this.contactRepository.delete({ id, userId: user.id })
    if (result.affected === 0) {
      throw new NotFoundException(`Contact with ID "${id}" not found`)
    }
  }

  async updateContact(
    id: string,
    updateContactDto: CreateUpdateContactDto,
    user: User,
  ): Promise<Contact> {
    return this.contactRepository.updateContact(id, updateContactDto, user)
  }
}
