import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      let user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      user = await this.userRepository.save(user);
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleExecption(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    let { email, password } = loginUserDto;
    email = email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: { email: true, password: true, id: true },
    });

    if (!user) {
      throw new BadRequestException('Credentials are not valid (email)');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Credentials are not valid (password)');
    }

    return { token: this.getJwtToken({ id: user.id }), ...user };
  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  private handleExecption(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error.message, error.stack);
    throw new InternalServerErrorException(
      'Unexpected server error, check server logs',
    );
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
