import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserPayloadDto {

  @Field()
  readonly id!: number;

  @Field()
  readonly name!: number;
}