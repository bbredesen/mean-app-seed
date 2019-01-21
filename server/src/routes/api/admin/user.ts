import passport from 'passport';
import { bearerAuthCheck } from '../../../passport';

import { Router, Request, Response } from 'express';
import { User, UserDoc } from '../../../orm/admin/User';
import model from 'seed-model';

export const router = Router();

const debug = require('debug')('berp:srv:api:admin:user');

/* List all users in the organization of the current user */
router.get('/list',
passport.authenticate('bearer', { session: false }),
  ( req : Request, res : Response ) => {
    User.find({  }).exec()//organization : req.user.organization._id
      .then( (userList : UserDoc[]) => res.send(userList) )
  }
)

router.get('/me',
  bearerAuthCheck,
  ( req : Request, res : Response ) => {
    debug(`/me -> Auth is: ${req.headers.authorization}`);
    res.json(req.user);
  }
)

/* Get a single user record by their internal id */
router.get('/:id',
  bearerAuthCheck,
  ( req : Request, res : Response ) => {
    User.find(
      {
       _id : req.params.id,
       // organization : req.user.organization._id
      }
    )
    .lean().exec()
    .then( result => res.json(result) )
  }
)

router.post('/',
  bearerAuthCheck,
  ( req : Request, res : Response ) => {
    const rec : model.admin.User = req.body;
    debug('POST\t-> %o', rec);

    // Ensure that the email address is unique
    User.findOne({email: rec.email}).lean().exec()
      .then( existingUser => {
        if (existingUser) {
          throw {
            status: 409,
            message: `A user with the email ${rec.email} already exists.`
          }
        }
        return User.create(rec);
      })
      .then( (result : UserDoc) => res.json(result) )
      .catch( err => {
        res.status(err.status).json(err);
      })
  }
)

router.put('/:id',
  bearerAuthCheck,
  ( req : Request, res : Response ) => {
    debug('PUT\Tt-> %s', req.params.id);

    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .lean().exec()
      .then( (result : UserDoc) => res.json(result) )
  }
)

router.delete('/:id',
  bearerAuthCheck,
  ( req : Request, res : Response ) => {
    debug('DELETE\t-> %s', req.params.id);
    User.findByIdAndRemove(req.params.id, req.body)
      .lean().exec()
      .then( (result : UserDoc) => res.json(result) )
  }
)
