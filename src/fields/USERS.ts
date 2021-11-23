import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class USERS {
  @Field()
  user_email!: string;

  @Field()
  user_password!: string;
}
