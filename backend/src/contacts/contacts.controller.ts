import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Logger,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ContactsService } from './contacts.service'
import { GetContactsFilterDto } from './dto/get-contact-filter.dto'
import { Contact } from './contact.entity'
import { User } from '../auth/user.entity'
import { GetUser } from '../auth/get-user.decorator'
import { CreateUpdateContactDto } from './dto/create-update-contact.dto'
import { ApiParam, ApiBearerAuth } from '@nestjs/swagger'

@Controller('contacts')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class ContactsController {
  private logger = new Logger('ContactsController')

  constructor(private contactsService: ContactsService) {}

  @Get()
  getContacts(
    @Query(ValidationPipe) filterDto: GetContactsFilterDto,
    @GetUser() user: User,
  ): Promise<Contact[]> {
    this.logger.verbose(
      `User "${
        user.username
      }" retrieving all contacts. Filters: ${JSON.stringify(filterDto)}`,
    )
    return this.contactsService.getContacts(filterDto, user)
  }

  @Post()
  @UsePipes(ValidationPipe)
  createContact(
    @Body() createContactDto: CreateUpdateContactDto,
    @GetUser() user: User,
  ): Promise<Contact> {
    this.logger.verbose(
      `User "${user.username}" creating a new contact. Data: ${JSON.stringify(
        createContactDto,
      )}`,
    )
    return this.contactsService.createContact(createContactDto, user)
  }

  @Delete('/:id')
  @ApiParam({ name: 'id' })
  deleteContact(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.contactsService.deleteContact(id, user)
  }

  @Put('/:id')
  @ApiParam({ name: 'id' })
  @UsePipes(ValidationPipe)
  updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: CreateUpdateContactDto,
    @GetUser() user: User,
  ): Promise<Contact> {
    return this.contactsService.updateContact(id, updateContactDto, user)
  }
}
