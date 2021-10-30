import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { UserPayloadDto } from 'src/common/dto/user.payload.dto';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}

  @Mutation()
  createUser(@Args('data') data: CreateUserDto) {
    return this.userService.createUser(data.name, data.password)
  }

  @Mutation()
  loginUser(@Args('data') data: LoginUserDto) {
    return this.userService.loginUser(data.name, data.password);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation()
  deleteUser(@CurrentUser() user: UserPayloadDto) {
    return this.userService.deleteUser(user.id);
  }
}
