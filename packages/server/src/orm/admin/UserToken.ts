import mongoose from 'mongoose';

import model from 'berp-model';
import { UserDoc } from './User';

export interface UserTokenDoc extends model.admin.UserToken, mongoose.Document {
  user : UserDoc
}

export const UserTokenSchema = new mongoose.Schema({
  user : { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  jwt : String
});

export const UserToken : mongoose.Model<UserTokenDoc> =
  mongoose.model('user_token', UserTokenSchema);
