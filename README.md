# MEAN Stack Seed Application in Typescript

This is a seed project to demonstrate a full MEAN stack application. Most
Angular tutorials that I've found online only show how to set up the front-end
application, generally ignore user authentication, and use either a third-party
API or (worse) hand waving assumptions that your backend API already exists.

This seed gives you a real world(-ish) application shell, including:
* The front end Angular client, with authenticated access to menu items and
navigation to adding new users
* The back end RESTful API, which authenticates access via a bearer token
* A decoupled data model, isolating the database technology (and access) from
the client.
* User authentication via Google OAuth2

## Setup & Run

The steps below assume that you already have MongoDB, Node, and Git installed,
and a Google developer account.

1. `git clone https://github.com/bbredesen/mean-app-seed your-new-project`
1. Create a project on the Google Developer Console and add credentials for the
project. The Javascript origin should just be `http://localhost:3000` for local
development, and the Redirect URI should initially be `http://localhost:3000/login/redirect`
1. Under the server source, copy `config.template.ts` to `config.ts`. Copy the
Client ID and Client Secret from Google and paste them into the appropriate
fields.
1. Replace "example@example.com" with your Google email address in `server/src/server.ts`
1. Start MongoDB on the default port (27017)
1. Finally, in a shell:

```
npm i && npm run build
npm run start
```

Your functional seed application is now running at http://localhost:3000/. Try
logging in, adding another user through the top left menu > User Management,
logging out, etc. Your current auth token is available on the dashboard, for
use in Postman/curl/etc. when directly calling API endpoints in development.

The code for each module has extensive comments explaining what it is doing.

## Structure

The data model is specifically broken out into it's own project so that it can
be reused in Angular (or any client framework) without exposing the
database technology to the client. You can include the model in another project by adding
`"seed-model": "file:../model"` to your `package.json` dependencies.

One quirk of this approach is that identifiers have to be
accessed with bracket notation, as the model does not define the object keys.
```
myRecord._id    // Typescript will throw an error
myRecord['_id'] // Ok!
```
In the `server` project:
* the `orm/` directory contains everything needed to bind the data model into Mongoose/MongoDB
* `routes/` defines HTTP endpoints and aggregates them into tiered Express
routers
* `config.ts` defines configuration options

### Angular Client
The client seed application is somewhat larger than the application generated
by `ng new`, in order to demonstrate some of the basic functionality needed for a real-world application.
In particular, it includes the Material UI framework libraries,
authentication and guarding of routes in the application, and it
includes one form component for adding new users to the application.
