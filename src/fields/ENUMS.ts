import { registerEnumType } from 'type-graphql'

/* ------------------------------- genre enum ------------------------------- */

export enum Genre {
  ACTION = 'Action',
  ADVENTURE = 'Adventure',
  FIGHTING = 'Fighting',
  MISC = 'Misc',
  PLATFORM = 'Platform',
  PUZZLE = 'Puzzle',
  RACING = 'Racing',
  ROLEPLAYING = 'Role-Playing',
  SHOOTER = 'Shooter',
  SIMULATION = 'Simulation',
  SPORTS = 'Sports',
  STRATEGY = 'Strategy',
}

registerEnumType(Genre, {
  name: 'genre',
  description: 'select games by different genres',
})

/* ------------------------------ console enum ------------------------------ */

export enum Console {
  _2600 = '2600',
  _3DO = '3DO',
  _3DS = '3DS',
  DC = 'DC',
  DS = 'DS',
  GB = 'GB',
  GBA = 'GBA',
  GC = 'GC',
  GEN = 'GEN',
  GG = 'GG',
  N64 = 'N64',
  NES = 'NES',
  NG = 'NG',
  PC = 'PC',
  PCFX = 'PCFX',
  PS = 'PS',
  PS2 = 'PS2',
  PS3 = 'PS3',
  PS4 = 'PS4',
  PSP = 'PSP',
  PSV = 'PSV',
  SAT = 'SAT',
  SCD = 'SCD',
  SNES = 'SNES',
  TG16 = 'TG16',
  WII = 'Wii',
  WIIU = 'WiiU',
  WS = 'WS',
  X360 = 'X360',
  XB = 'XB',
  XONE = 'XOne',
}

registerEnumType(Console, {
  name: 'console',
  description: 'select games by different consoles',
})

/* ------------------------------- rating enum ------------------------------ */

export enum Rating {
  AO = 'AO',
  E = 'E',
  E10PLUS = 'E10+',
  EC = 'EC',
  K_A = 'K-A',
  M = 'M',
  RP = 'RP',
  T = 'T',
}

registerEnumType(Rating, {
  name: 'rating',
  description: 'select games by different ratings',
})

/* ------------------------------ groupBy enum ------------------------------ */

export enum GroupByColumn {
  GENRE = 'genre',
  RATING = 'rating',
  CONSOLE = 'console',
  TITLE = 'title',
  PUBLISHER = 'publisher',
  YEAR_OF_RELEASE = 'year_of_release',
}

registerEnumType(GroupByColumn, {
  name: 'Column',
  description: 'The columns that can be used to group the search by',
})

/* ------------------------ orderBy column name enum ------------------------ */

export enum OrderByColumnName {
  TITLE = 'title',
  CONSOLE = 'console',
  YEAR_OF_RELEASE = 'year_of_release',
  PUBLISHER = 'publisher',
  GENRE = 'genre',
  RATING = 'rating',
  CRITIC_SCORE = 'critic_score',
  USER_SCORE = 'user_score',
  DEVELOPER = 'developer',
  GLOBAL_SALES = 'global_sales',
  NA_SALES = 'na_sales',
  EU_SALES = 'eu_sales',
  JP_SALES = 'jp_sales',
  OTHER_SALES = 'other_sales',
}

registerEnumType(OrderByColumnName, {
  name: 'OrderByColumns',
  description: 'select columns to order results by',
})

/* ---------------------- order by sort direction enum ---------------------- */

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

registerEnumType(SortOrder, {
  name: 'SortOrder',
  description:
    'select whether column should be sorted as ascending or descending',
})
