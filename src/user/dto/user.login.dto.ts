import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginUserDto {
  @Field()
  readonly name!: string;

  @Field()
  readonly password!: string;
}
