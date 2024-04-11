---PRISMA---

Prisma is a library that lets you interact easily with your database. It all starts with your Prisma schema.

Inside schema.prisma we found what tells Prisma that we want it to connect to our SQLite database.

This file is also used to tell Prisma about the different kinds of data or different structures we want to have inside the database as well.

The "models" inside the file define different tables or collections of data that are going to exist inside of our SQLite database.

npx prisma init --datasource-provider sqlite -> initialize our schema prisma
npx prisma migrate dev -> create our db

---OAUTH AND NEXTAUTH---

We are doing our authentication with Github. So that means we are going to have a classic sign in with Github kind of button in our application.

To do so, we have to create a OAuth app on Github's website. So you need a github account.

Navigate to: github.com/settings/applications/new

I am going to call the Application name "DEV-Discuss" because DEV stands for development. If I need this app to be in production I will create a separate set of authentication keys through GitHub's website.

AUTH_SECRET = can be anything.. (i just typed in those numbers and letters)

---PRISMAADAPTER---

Whenever a user signs into our application or signs up for the very first time, we need to store some informartion in our database about them.

So we need something that stores a list of all of our different users and what their username is, their avatar picture posted on github.com, and so on.

We only have one database in our project and that is SQLite that we access through the Prisma library.

All the "models" inside of our schema.prisma file are going to be automatically read by our PrismaAdapter.

It's going to reach into our database and try to create a new user record that requires a couple of very specific properties assigned to them, such as : name, email, id, verified image, accounts and sessions.

So whenever a user signs up for the first time, that Prisma Adapter is going to try to create a new user record with specifically these properties.
