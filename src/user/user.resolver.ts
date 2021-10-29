import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserData } from 'src/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
  ) {}

  @Mutation(() => User)
  createUser(@Args('data') data: CreateUserData) {
    return this.userService.createUser(data.name, data.password)
  }
}
