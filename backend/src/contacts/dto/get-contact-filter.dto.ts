import { IsOptional, IsNotEmpty } from 'class-validator'
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger'

export class GetContactsFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search: string
  @ApiProperty()
  @IsNotEmpty()
  page: number
}
