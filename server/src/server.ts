import express from 'express';
import { Request, Response } from 'express'; // Shortcut. You could also specify variable/argument types as express.Request

import config from './config';
import log from './logging';

// Establishes a connection to a MongoDB instance.
import connection from './db_connection';

// Create a default user, if they don't exist yet.
import * as model from 'seed-model';
import { User, UserDoc } from './orm/admin/User';

let user : model.admin.User = model.admin.initDefaultUser();
user.email = 'example@example.com'; // Put your Google email address here

User.findOne({ email : user.email }).lean().exec()
  .then( (result : UserDoc ) => {
    if (!result) {
      User.create(user).then( () => log.info(`Created an initial user record for ${user.email}`));
    }
  });

// Sets up paths for authentication and configures Google OAuth through passport.
import http from 'http';
import path from 'path';
import bodyParser from 'body-parser';

const app : express.Express = express();

// Helmet sets some HTTP headers to improve security
import * as helmet from 'helmet';
app.use(helmet());

/*
Default in-memory session handling is not appropriate for production, so
store sessions in our MongoDB instance instead.
*/
import session from 'express-session';
import connectMongo from 'connect-mongo';
const MongoStore = connectMongo(session);

app.use(session({
  secret: config.session.secret,
  store: new MongoStore({mongooseConnection: connection}),
  resave: true,
  saveUninitialized: true,
  cookie: { secure: 'auto' }
}))

// Use bodyParser to handle POST data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import passport from 'passport';
app.use(passport.initialize());

// A few demo paths
app.get('/hello', (req : Request, res : Response) => res.send('<h1>Hello.</h1><p>This demonstration response is sent directly from Express, <b>not</b> through Angular.</p>') )
app.get('/broken', (req : Request, res : Response) => res.sendStatus(404));

import AuthRouter from './routes/auth';
app.use(AuthRouter);

import ApiRouter from './routes/api/index';
app.use('/api', ApiRouter);

// Static resources (.js, .css, etc.) are stored under the Angular client
app.use(express.static(path.join(__dirname, 'client/')));
// Everything else goes through Angular's routing in index.html
app.get('*', (req : Request, res : Response) => {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

const port : string = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => log.info(`Server running on ${port}`));
