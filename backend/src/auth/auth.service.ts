import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from './user.repository'
import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtPayload } from './jwt-payload.interface'

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService')

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    await this.userRepository.signUp(authCredentialsDto)
    return this.signIn(authCredentialsDto)
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    )

    if (!username) {
      throw new BadRequestException('Invalid credentials')
    }

    const payload: JwtPayload = { username }
    const accessToken = await this.jwtService.sign(payload)
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    )

    return { accessToken }
  }
}
