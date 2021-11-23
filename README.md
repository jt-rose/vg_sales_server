# vg_sales_server
graphql/ postgres server for analyzing history of video game sales across consoles, genres, years, etc.

### Core Dependencies
- Express Apollo Server
- Type GraphQL
- Knex SQL Query Builder

### Databases
- PostgreSQL
- Redis for rate limiting IP addresses

### Data Source
https://www.kaggle.com/juttugarakesh/video-game-data

### Booting Up the Server
This is meant as the backend / database for a frontend being developed at [VG Sales Client] , but can be 
run on its own with the GraphQL playground by doing the following:

1. Have Node, Redis and Postgres installed locally or running on docker
2. Use the included SQL commands and CSV files to generate the database
3. Copy the code and run `npm install` or `yarn install`
4. Run `npm run start` or `yarn start` to initialize the server
5. Access the GraphQL playground on http://localhost:8000/graphql

[VG Sales Client]: https://github.com/jt-rose/vg_sales_client
