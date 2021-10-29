import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ApolloError } from 'apollo-server-errors';
import { Repository } from 'typeorm';
import { User } from './user.model';
import bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private _usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  public async createUser(name: string, password: string) {
    const existUser = await this._usersRepository.findOne({
      where: { name },
    })
    if (existUser) {
      throw new ApolloError('name already exist')
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await new User();
    user.name = name;
    user.password = hashedPassword;
    return await this._usersRepository.save(user)
  }
}
