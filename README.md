## Description

Application to manage electric inspection reports. The application is developed using NestJS, a progressive Node.js framework for building efficient, reliable and scalable server-side applications. The application uses a PostgreSQL database to store the data.

## Installation

```bash
$ npm install

$ cp .env.example .env # fill in the test database credentials

$ cp .env.test.example .env.test # fill in the test database credentials
```

## Running the app

```bash
# create the database
$ docker-compose up -d
# todo: create a script to setup  the database

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## License

App is MIT licensed.
