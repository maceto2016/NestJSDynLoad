# NestJS with dynamic module loading

![Nest Dynamic Module Loading](./assets/nest-dynamic.png)

## Description

[**NestJS**](https://github.com/nestjs/nest) is is a well-built server side Typescript framework that implements important design patterns like [**Dependency Injection Principle**](https://en.wikipedia.org/wiki/Dependency_injection).

NestJS centralizes all the needed tecnologies to build consistent micro-services or monolithic servers using Nodejs.

NestJS uses three main build blocks to form an application:

- Controllers
- Providers
- Modules

> **Controllers** in NestJS are responsible for handling any incoming requests and returning responses to the client side of the application.

> **Providers** (also called services) can be created and injected into controllers or other providers. Providers are designed to abstract any form of complexity and logic.

> **Modules** let you group related files. Providers and controllers are referenced through modules. In NestJS, modules encapsulate providers by default. In other words, it is not possible to inject providers into a module that are not part of the module or exported from another module. Modules can import other modules - basically, this enables sharing of providers across modules.

Below is a diagram that illustrates the concept of modules in NestJS.

![Nest Modules](./assets/modules.png)

As you can see, every application has at least one root module (the application module). The **root module** is basically the starting point that NestJS uses to build the **application graph**.

In nestjs modules are defined as classes with the @Module decorator that takes a object as input which has sections (properties) to create the relationship between modules, providers and controllers:

> **Providers** It takes a list of providers as input. These providers will be instantiated by the NestJS injector. By default, a Provider belonging to a Module will be available within the module.

> **Controllers** This array specifies the set of controllers in the module. Basically, NestJS will automatically instantiate them during startup.

> **Imports** In this section, we can specify the list of imported modules. Basically, this enables sharing of providers across modules

> **Exports** This specifies the providers that are provided by this module. In other words, we specify the providers that are exported by this module.

## Pre-requisites

We assume you have **git cli**, **nodejs** and **nestjs cli** installed on your system. This tutorial was run in a **_linux environment_**, but you would easily tweak this for your preferred operating system.

## A simple NestJS Application

We will create two versions of an API to access the contents of two entities (tables) in a pseudo-database - just looking for items by its id.

The first version made in the conventional format where we will import into the appmodule each of the two modules that encapsulate the entities.

The second version will dynamically import any and all modules present in the /src/db/entity subdirectory

This is cool, as if you create new modules for new entities in this subdirectory, those modules will be dynamically imported without you having to reference them. You will just create them and they will be part of the system automatically

In this way our system will have this format:

![API APP](./assets/api-app.png)

## The entity unit

For each entity we will have a controller that will respond to HTTP requests, a service (used by controller) that will perform a search on the entity's data and a module that will refer to the corresponding controller and service (as depicted in the diagram above we have the units corresponding to the entities **Book** and **Movie**).

## Version **WITHOUT** dynamic module loading

Enough of theory, let's put the dough to work!

Below we have the subdirectory with our API APP:

![API DIR](./assets/api-dir.png)

Let's examine the most relevant source codes

### **_app.module.ts_**

The root module **_app.module.ts_** simply imports the Book and Movie entity modules into the system.

```typescript
import { Module } from '@nestjs/common';
import { BookModule } from './db/entity/book/book.module';
import { MovieModule } from './db/entity/movie/movie.module';

@Module({
  imports: [BookModule, MovieModule],
})
export class AppModule {}
```

The db/entity subdirectory contains the list of entities (Book and Movie) with their respective module, provider and controller files. Due to similarity, we will only examine the source code of the Book entity.

### **_book.module.ts_**

The module **_book.module.ts_** is also very simple. Just load controller **_book.controler.ts_** and make provider **_book.service.ts_** available.

```typescript
import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';

@Module({
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
```

### **_book.controller.ts_**

The controller **_book.controller.ts_** responds for HTTP GET requenst on the path **/book** accepting the **ID** parameter and just returns the book with the
corresponding ID.

The controller uses the **book.service.ts** service's findById method to search and return the book corresponding to the **ID**.

```typescript
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { BookService, Book } from './book.service';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBook(@Query('id', ParseIntPipe) id: number): Book {
    return this.bookService.findById(id);
  }
}
```

### **_book.service.ts_**

Finally, the **_book.service.ts_** service simply provides the **findoById** method that returns a book by its **ID** from a pseudo table of books.

```typescript
import { Injectable } from '@nestjs/common';

export interface Book {
  id: number;
  title: string;
}

@Injectable()
export class BookService {
  private static _books: Array<Book> = [
    {
      id: 1,
      title: 'Nest.js: A Progressive Node.js Framework (English Edition)',
    },
    { id: 2, title: 'NestJS Build a RESTFul CRUD API' },
    { id: 3, title: 'Pratical Nest.js' },
  ];

  findById(id: number): Book {
    return BookService._books.find((book) => book.id === id);
  }
}
```

### Executing the API

When running the API with the command:

```bash
# Run the NestJS server app
$ nest start
```

You will see the following messages on your console:

![API CONSOLE](./assets/api-console.png)

Easy and clean. Now let's complicate things a bit.

## Version **WITH** dynamic module loading

## Running the example from this tutorial

### Installation

```bash
# Clone tutorial repository
$ git clone https://github.com/maceto2016/NestJSDynLoad

# access the project folder through the terminal
$ cd NestJSDynLoad

# Install dependencies
$ npm install
```

### Running the app (from NestJSDynLoad folder)

```bash
# Run the NestJS server app
$ nest start
```

### Testing the app

```bash
# Get book with id = 1
$ curl http://localhost:3000/book?id=1 | json_pp
```

## Conclusion

In this tutorial we made a small introduction to the well-built NestJS framework.

We demonstrate how to dynamically load all modules present in a given subdirectory into your NestJS app without the need for you to manually reference such modules in code. This can be practical in some situations.

I thank you for reading. I would be happy to hear your feedback!
