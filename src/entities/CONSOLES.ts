import { Field, Float, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class CONSOLES {
  @Field()
  console!: string

  @Field()
  full_name!: string

  @Field(() => Int)
  year_released!: number

  @Field(() => Float, { nullable: true })
  global_sales: number

  @Field()
  maker!: string

  @Field(() => String!)
  console_type: 'home' | 'handheld'
}
