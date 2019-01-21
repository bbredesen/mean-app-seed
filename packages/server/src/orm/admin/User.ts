import mongoose from 'mongoose';

import model from 'berp-model';

export interface UserDoc extends model.admin.User, mongoose.Document { }

export const UserSchema = new mongoose.Schema({
  email : String,
  givenName : String,
  surname : String,
  googleId : String,
  profilePhotoURL : String,
  lastLogin : Date
});

export const User : mongoose.Model<UserDoc> =
  mongoose.model('user', UserSchema);
