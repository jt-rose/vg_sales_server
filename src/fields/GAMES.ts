import { Field, Int, ObjectType } from 'type-graphql'
import { Genre, Rating } from './ENUMS'

@ObjectType()
export class GAMES {
  @Field(() => Int)
  id!: number

  @Field()
  title!: string

  @Field()
  console!: string

  @Field(() => Int)
  year_of_release!: number

  @Field(() => Genre)
  genre!: Genre

  @Field()
  publisher!: string

  // millions
  @Field()
  na_sales!: number

  @Field()
  eu_sales!: number

  @Field()
  jp_sales!: number

  @Field()
  other_sales!: number

  @Field()
  global_sales!: number

  @Field(() => Int, { nullable: true })
  critic_score: number

  @Field(() => Int, { nullable: true })
  critic_count: number

  @Field(() => Int, { nullable: true })
  user_score: number

  @Field(() => Int, { nullable: true })
  user_count: number

  @Field({ nullable: true })
  developer: string

  @Field(() => Rating, { nullable: true })
  rating: Rating
}
