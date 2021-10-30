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

  public async loginUser(name: string, password: string) {
    const user = await this._usersRepository.findOne({
      where: { name },
    })
    if (!user) {
      throw new ApolloError('User not found')
    }

    const { id } = user
    const result = await bcrypt.compare(password, user.password)
    if (result) {
      const accessToken = await this.jwtService.sign({
        id,
        name
      })
      return [accessToken, id] // 테스트케이스 통과용 입니다.
    }
    throw new ApolloError('Wrong password')
  }

  public async deleteUser(id: string) {
    console.log('@@@@@@@@@@@', id)
    const user = await this._usersRepository.findOne({
      where: { id }
    })
    if (!user) {
      throw new ApolloError('User not found')
    }
    const result = await this._usersRepository.softDelete(id)
    if (result) {
      return true
    }
    return false
  }
}
