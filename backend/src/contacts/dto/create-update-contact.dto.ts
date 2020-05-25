import { IsNotEmpty, IsEmail, IsPhoneNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUpdateContactDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber(null)
  phoneNumber: string
}
