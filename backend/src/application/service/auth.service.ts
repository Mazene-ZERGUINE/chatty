import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto/request/user-create.dto';
import { HashUtils } from '../../infrastructure/security/hash.utils';
import { ConfigService } from '@nestjs/config';
import { PhoneNumber } from '../../domain/vo/phone-number';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
  ) {
    new HashUtils(this.configService);
  }

  async register(user: UserCreateDto): Promise<void> {
    const isExistingUser = await this.checkUserExists(user);
    if (isExistingUser) {
      throw new ConflictException('User already exists');
    }
    const phoneNumber: string = PhoneNumber.create(
      user.countryCode,
      user.phoneNumber,
    ).toPhoneNumber();
    const hashedPassword = await HashUtils.hashPassword(user.password);

    const newUser = { ...user, phoneNumber, password: hashedPassword };
    await this.usersRepository.save(newUser);
  }

  private async checkUserExists(user: UserCreateDto): Promise<boolean> {
    return (
      (await this.usersRepository.findOneBy({ email: user.email })) !==
      undefined
    );
  }
}
