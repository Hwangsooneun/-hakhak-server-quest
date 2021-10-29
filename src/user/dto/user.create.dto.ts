import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto {
  @Field()
  readonly name!: string;

  @Field()
  readonly password!: string;
}
