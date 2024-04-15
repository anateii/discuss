_PRISMA_

Prisma is a library that lets you interact easily with your database. It all starts with your Prisma schema.

Inside schema.prisma we found what tells Prisma that we want it to connect to our SQLite database.

This file is also used to tell Prisma about the different kinds of data or different structures we want to have inside the database as well.

The "models" inside the file define different tables or collections of data that are going to exist inside of our SQLite database.

npx prisma init --datasource-provider sqlite -> initialize our schema prisma
npx prisma migrate dev -> create our db

_OAUTH AND NEXTAUTH_

We are doing our authentication with Github. So that means we are going to have a classic sign in with Github kind of button in our application.

To do so, we have to create a OAuth app on Github's website. So you need a github account.

Navigate to: github.com/settings/applications/new

I am going to call the Application name "DEV-Discuss" because DEV stands for development. If I need this app to be in production I will create a separate set of authentication keys through GitHub's website.

AUTH_SECRET = can be anything.. (i just typed in those numbers and letters)

_PRISMAADAPTER_

Whenever a user signs into our application or signs up for the very first time, we need to store some informartion in our database about them.

So we need something that stores a list of all of our different users and what their username is, their avatar picture posted on github.com, and so on.

We only have one database in our project and that is SQLite that we access through the Prisma library.

All the "models" inside of our schema.prisma file are going to be automatically read by our PrismaAdapter.

It's going to reach into our database and try to create a new user record that requires a couple of very specific properties assigned to them, such as : name, email, id, verified image, accounts and sessions.

So whenever a user signs up for the first time, that Prisma Adapter is going to try to create a new user record with specifically these properties.

_HOW OAUTH WORKS_

1. User wants to Sign Up! Redirect them to Github servers with 'client_id'

(github.com/login/oauth/authorize?client_id=123)

2. On Github servers, they are going to receive the user's request and Github is going to present a page to them asking if it's ok to share their Information with our app

3. If yes, the user gets redirected to our server with the same callback address we appointed to in our OAuth config field when we set up our OAuth app on Github

4. When it gets called it's going to receive a query string param of code (ex. localhost:3000/api/auth/github/callback?

## code=456)

(github.com/login/oauth/authorize?client_id=123) && (localhost:3000/api/auth/github/callback?

## code=456) => Requests made by user's browser

5. Our server takes the code and makes a followup request to Github. After this every request is a communication between our server and Github.

(github.com/login/oauth/access_token{clientId, clientSecret,code})

6. Github makes sure the clientID, clientSecret and code are valid then responds with an 'access_token' which allows us to access information about the user so we can get out of their profile things like their name, their email, their profile image and stuff like that

7. In order to get all this we have to make another request where we include an Authorization Header that includes the access token we were just given

api.github.com/user Authorization: Bearer abc123

8. In response to that request, Github is goin to send back the user's profile

9. Once we get back all this, Prisma Adapter is going to take it and automatically create a new user record in the database

10. After that we still need some way to kind of identify this user whenever they make a request to our server. To do so we send a COOKIE that is going to include some information securely encripted about the person who's making the request.

11. NextAuth is going to read in that cookie data, figure out who's making a request to us and then modify the incoming request a little bit so the rest of our application can understand exactly who's making this request.

_CHECKING AUTH STATUS FROM SERVER AND CLIENT COMPONENTS_

## SERVER COMPONENTS

```
    import { Button } from "@nextui-org/react";
    import \* as actions from "../actions/index";
    import { auth } from "@/auth";

    export default async function Home() {
    const session = await auth();
    //In Server Components the session can be null or an object containing the    user's data

    return (

    <div>
    <form action={actions.signIn}>
    <Button type="submit">Sign In</Button>
    </form>

          <form action={actions.signOut}>
            <Button type="submit">Sign Out</Button>
          </form>

          {session?.user ? (
            <div>{JSON.stringify(session?.user)}</div>
          ) : (
            <div>Signed out</div>
          )}
        </div>
    )
    ;
    }
```

## CLIENT COMPONENTS

We need a Session Provider which is usign React's context system to share information about whether or not the user is signed in throughout all the client components in our application. We need to set it up in our providers.tsx file.

In Client Components the session is an object that is always defined.

The actual session data is available on a .data property which might be null and then inside there, there might be a user property which is going to be defined if the user is Signed In.

```
    "use client";

    import { useSession } from "next-auth/react";

    export default function Profile() {
    const session = useSession();

    if (session.data?.user) {
    return <div>From client: user is Signed In</div>;
    }

    return <div>From client: user is Signed Out</div>;
    }
```

## RECOMMENDED INITIAL DESIGN

1. Identify all the different routes you want your app to have + the data that each shows
2. Make 'path helper' functions that will have a clear name for each of our route in the application. It's easier to handle this in a single file
3. Create your routing folders + page.tsx files based on number 1
4. Identify the places where data changes in your app
5. Make empty server actions for each of those
6. Add in comments on what paths you'll need to revalidate for each server action
