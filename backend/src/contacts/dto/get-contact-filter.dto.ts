import { IsOptional, IsNotEmpty } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class GetContactsFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  search: string
}
