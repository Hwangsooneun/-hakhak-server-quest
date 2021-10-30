import { InputType } from '@nestjs/graphql';
import { LoginUserDto } from './user.login.dto';

@InputType()
export class CreateUserDto extends LoginUserDto {}