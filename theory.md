---PRISMA---

Prisma is a library that lets you interact easily with your database. It all starts with your Prisma schema.

Inside schema.prisma we found what tells Prisma that we want it to connect to our SQLite database.

This file is also used to tell Prisma about the different kinds of data or different structures we want to have inside the database as well.

The "models" inside the file define different tables or collections of data that are going to exist inside of our SQLite database.

npx prisma init --datasource-provider sqlite -> initialize our schema prisma
npx prisma migrate dev -> create our db
