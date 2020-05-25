import { ContactsRepository } from './contacts.repository'
import { GetContactsFilterDto } from './dto/get-contact-filter.dto'
import { User } from '../auth/user.entity'
import { InternalServerErrorException } from '@nestjs/common'
import { CreateUpdateContactDto } from './dto/create-update-contact.dto'
import { MockLogger } from '../util/logger.mock'

const mockUser = {
  id: '17338a98-99d5-11ea-bb37-0242ac130002',
  username: 'Mock User',
} as User

jest.mock('../auth/user.entity', () => ({
  save: jest.fn(),
}))

describe('ContactsRepository', () => {
  let mockLogger: MockLogger
  let contactsRepository: ContactsRepository

  beforeEach(async () => {
    mockLogger = new MockLogger('ContactsRepository')
    contactsRepository = new ContactsRepository()
    ;(contactsRepository as any).logger = mockLogger
  })

  describe('getContacts', () => {
    let filterDto: GetContactsFilterDto
    let queryMethods

    beforeEach(() => {
      queryMethods = {
        where: jest.fn(),
        andWhere: jest.fn(),
        getMany: jest.fn(),
      }

      contactsRepository.createQueryBuilder = jest
        .fn()
        .mockReturnValue(queryMethods)
    })

    it('gets contacts using query builder', () => {
      filterDto = { search: null }

      expect(
        contactsRepository.getContacts(filterDto, mockUser),
      ).resolves.not.toThrow()
      expect(contactsRepository.createQueryBuilder).toHaveBeenCalledWith(
        'contact',
      )
      expect(queryMethods.where).toHaveBeenCalledWith(
        'contact.userId = :userId',
        {
          userId: mockUser.id,
        },
      )
      expect(queryMethods.andWhere).not.toHaveBeenCalled()
      expect(queryMethods.getMany).toHaveBeenCalled()
    })

    it('gets contacts with search filter', () => {
      filterDto = { search: 'Test' }
      contactsRepository.getContacts(filterDto, mockUser)

      expect(queryMethods.andWhere).toHaveBeenCalledTimes(1)
      expect(
        queryMethods.andWhere,
      ).toHaveBeenCalledWith(
        '(contact.name LIKE :search OR contact.lastName LIKE :search OR contact.email LIKE :search OR contact.phoneNumber LIKE :search)',
        { search: `%${filterDto.search}%` },
      )
    })

    it('throws error if retrieving contacts fails', async () => {
      queryMethods.getMany = jest.fn().mockRejectedValue(new Error('Woops!'))
      filterDto = { search: null }
      await expect(
        contactsRepository.getContacts(filterDto, mockUser),
      ).rejects.toThrow(InternalServerErrorException)
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })

  describe('createContact', () => {
    const createUpdateContactDto: CreateUpdateContactDto = {
      name: 'User name',
      lastName: 'User last name',
      email: 'user@example.email',
      phoneNumber: '+34666666666',
    }

    it('creates a contact', async () => {
      const save = jest.fn()
      contactsRepository.create = jest.fn().mockImplementation(() => ({ save }))

      const result = await contactsRepository.createContact(
        createUpdateContactDto,
        mockUser,
      )
      expect(save).toHaveBeenCalled()
      expect(result.name).toEqual(createUpdateContactDto.name)
      expect(result.lastName).toEqual(createUpdateContactDto.lastName)
      expect(result.email).toEqual(createUpdateContactDto.email)
      expect(result.phoneNumber).toEqual(createUpdateContactDto.phoneNumber)
      expect(result.user).not.toBeDefined()
    })

    it('throws an error as contact saving failed', async () => {
      const save = jest.fn().mockRejectedValue(new Error('Woops!'))

      contactsRepository.create = jest.fn().mockImplementation(() => ({ save }))
      await expect(
        contactsRepository.createContact(createUpdateContactDto, mockUser),
      ).rejects.toThrow(InternalServerErrorException)
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
