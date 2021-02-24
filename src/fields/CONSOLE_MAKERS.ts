import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class CONSOLE_MAKERS {
  @Field()
  maker!: string
}
