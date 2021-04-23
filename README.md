# Fundi - A REST API backend based on Fastify

**Fundi** is an application scaffold for REST API backend based on **[Fastify](https://www.fastify.io)**.

> **NB:** This project should be considered WIP and it doesn't aim to reflect the best way Fastify should be used, but it's rather an experiment to help driving into Fastify best practices.


### Why *Fundi* name?

**Fundi** comes from Swahili and means technician, artisan, craftsman.

**Fundi** is intended to be a scaffold to build business web application using Fasify.

### Why *Fastify*?

Because **[Fastify](https://www.fastify.io)** is an interesting and fast-growing framework to build server-side web applications focused on performance. 

Even if this project is not indeed to be "fast", the Fastify framework is chosen for its service/plugin/middleware architecture approach, which could be a key feature to build flexible and extensible software in a business application context.

There are plenty of "batteries-included" "opinionated" frameworks that can solve this problem, most of them are based on Express.js, this would be a scaffold built from scratch using Fastify.

## Contribute

This project is a prototype open to everyone who wants to contribute to defining what could be the best approach for a better developer experience. Feel free to open a pull request or open an issue.

## How to run this project in 4 steps

1. Clone repository and run `npm install`

  ```sh
  $ git clone git@github.com:etino/fundi.git
  $ cd fundi
  $ npm install
  ```

2. Copy `.env.template` in `.env` and set your environment variables

3. Database initialization (default engine `sqlite3` in `/data` folder - need to be created)

  ```sh
  $ mkdir data
  $ npm run db:migrate:latest
  $ npm run db:seed:run // load data with defaults
  ```

4. Run the server and open [http://localhost:3000/documentation](http://localhost:3000/documentation)

  ```sh
  $ npm run start 
  ```

## Service architecture

Implemented services are located in `service` directory. Actually only `users` service is implemented.

Every service has the following architecture

- `index.js` for routes and handler functions
- `service.js` for business logic
- `models` directory for ORM (Objection.js) models.

## TODO

- [ ] define a standard (automatic) CRUD implementation
- [ ] evaluate ORM alternatives (for example Prisma.io)
- [ ] convert to Typescript(?)
- [ ] implement a test strategy

## References

### Plugins and Libraries used

- [fastify-cli](https://github.com/fastify/fastify-cli)
- [fastify-autoload](https://github.com/fastify/fastify-autoload)
- [fastify-env](https://github.com/fastify/fastify-env)
- [fastify-jwt](https://github.com/fastify/fastify-jwt)
- [fastify-objectionjs](https://github.com/jarcodallo/fastify-objectionjs) based on [knex.js](http://knexjs.org/) and [Objection.js](https://vincit.github.io/objection.js/)
- [fastify-swagger](https://github.com/fastify/fastify-swagger) based on [Swagger.io](https://swagger.io/) with [OpenAPI 3.0 Specification](https://swagger.io/specification/)


### Project References

Fundi is build starting from this examples projects
- [Fastify twitter clone](https://github.com/fastify/fastify-example-twitter) by [@fastify](https://github.com/fastify/)
- [Fastify App Example](https://github.com/delvedor/fastify-example) by [@delvedor](https://github.com/delvedor)
- [fastify/objection/jwt](https://github.com/asdelatoile/fastify-objection-jwt) by [@asdelatoile](https://github.com/asdelatoile/)