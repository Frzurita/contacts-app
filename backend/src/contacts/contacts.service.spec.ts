import { ContactsService } from './contacts.service'
import { ContactsRepository } from './contacts.repository'
import { User } from 'src/auth/user.entity'
import { GetContactsFilterDto } from './dto/get-contact-filter.dto'
import { NotFoundException } from '@nestjs/common'
import { CreateUpdateContactDto } from './dto/create-update-contact.dto'
import { Test } from '@nestjs/testing'

const uuidMock = '17338a98-99d5-11ea-bb37-0242ac130002'

const mockUser = {
  id: uuidMock,
  username: 'Mock User',
} as User

const mockContactsRepository = () => ({
  getContacts: jest.fn(),
  findOne: jest.fn(),
  createContact: jest.fn(),
  delete: jest.fn(),
})

describe('ContactService', () => {
  let contactsService: ContactsService
  let contactsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ContactsService,
        { provide: ContactsRepository, useFactory: mockContactsRepository },
      ],
    }).compile()

    contactsRepository = await module.get<ContactsRepository>(
      ContactsRepository,
    )
    contactsService = await module.get<ContactsService>(ContactsService)
  })

  it('gets all contacts', () => {
    contactsRepository.getContacts = jest.fn()

    const mockFilterDto: GetContactsFilterDto = {
      search: 'Mock contact search',
    }

    contactsService.getContacts(mockFilterDto, mockUser)
    expect(contactsRepository.getContacts).toHaveBeenCalledWith(
      mockFilterDto,
      mockUser,
    )
  })

  describe('getContactById', () => {
    it('calls contactsRepository.findOne() and successfully gets a contacts', async () => {
      contactsRepository.findOne.mockResolvedValue({
        name: 'Test name',
        lastName: 'Test lastName',
      })

      const result = await contactsService.getContactById(uuidMock, mockUser)
      expect(contactsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: uuidMock,
          userId: mockUser.id,
        },
      })

      expect(result.name).toEqual('Test name')
      expect(result.lastName).toEqual('Test lastName')
    })

    it('throws an error as contact is not found', async () => {
      contactsRepository.findOne.mockResolvedValue(null)
      expect(contactsService.getContactById('', mockUser)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('createContact', () => {
    it('calls contactsRepository.createContact()', () => {
      expect(contactsRepository.createContact).not.toHaveBeenCalled()
      contactsService.createContact({} as CreateUpdateContactDto, mockUser)
      expect(contactsRepository.createContact).toHaveBeenCalled()
    })
  })

  describe('deleteContact', () => {
    it('calls contactsRepository.delete()', () => {
      contactsRepository.delete.mockResolvedValue({ affected: 1 })
      expect(contactsRepository.delete).not.toHaveBeenCalled()
      contactsService.deleteContact(uuidMock, mockUser)
      expect(contactsRepository.delete).toHaveBeenCalled()
    })

    it('throws an exception as contact is not found', () => {
      contactsRepository.delete.mockResolvedValue({ affected: 0 })
      expect(contactsService.deleteContact(uuidMock, mockUser)).rejects.toThrow(
        NotFoundException,
      )
    })
  })

  describe('updateContactStatus', () => {
    it('retrieves and updates a contact', async () => {
      const save = jest.fn()

      contactsService.getContactById = jest.fn().mockResolvedValue({
        save,
      })

      const result = await contactsService.updateContactStatus(
        uuidMock,
        mockUser,
      )
      expect(contactsService.getContactById).toHaveBeenCalledWith(
        uuidMock,
        mockUser,
      )
      expect(save).toHaveBeenCalled()
    })
  })
})
