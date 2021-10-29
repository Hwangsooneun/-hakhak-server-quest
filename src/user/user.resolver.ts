import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/user.create.dto';
import { LoginUserDto } from './dto/user.login.dto';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('data') user: CreateUserDto) {
    return this.userService.createUser(user.name, user.password)
  }

  @Mutation(() => User)
  loginUser(@Args('data') user: LoginUserDto) {
    return this.userService.loginUser(user.name, user.password)
  }
}
