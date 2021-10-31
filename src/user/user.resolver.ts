import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDto } from 'src/common/dto/user.payload.dto';
import { CreateUserData, LoginUserData } from '../graphql';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}

  @Mutation()
  createUser(@Args('data') data: CreateUserData) {
    return this.userService.createUser(data.name, data.password)
  }

  @Mutation()
  loginUser(@Args('data') data: LoginUserData) {
    return this.userService.loginUser(data.name, data.password);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation()
  deleteUser(@CurrentUser() user: UserPayloadDto) {
    return this.userService.deleteUser(user.id);
  }
}