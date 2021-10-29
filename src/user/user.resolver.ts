import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserDto } from './dto/user.create.dto';
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
}
