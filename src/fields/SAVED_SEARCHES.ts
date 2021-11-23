import { Field, ObjectType } from "type-graphql";
import { PaginatedQueryOptions } from "./QUERY_OPTIONS";

@ObjectType()
export class SAVED_SEARCHES {
  @Field()
  saved_search_id!: number;

  @Field()
  user_email!: string;

  @Field(() => PaginatedQueryOptions)
  search_settings!: PaginatedQueryOptions;
}
