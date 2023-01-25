import mongoose from 'mongoose';
import * as _ from 'lodash';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';


const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  password: { type: String, required: true }
}, {
  collection: 'password'
});

const PasswordModel = mongoose.model('password', passwordSchema);

async function createOrUpdate(data) {
  const result = await PasswordModel.findOneAndUpdate({ userId: data.userId }, _.omit(data, 'id'), { new: true });
  if (!result) {
    const result = await new PasswordModel({ userId: data.userId, password: data.password }).save();
    if (result) {
      return mongoConverter(result);
    }
  }
  return result;
}

async function authorize(userId, password) {
  const result = await PasswordModel.findOne({ userId: userId, password: password });
  if (result && mongoConverter(result)) {
    return true;
  }
  throw applicationException.new(applicationException.UNAUTHORIZED, 'User and password does not match');
}

async function changePassword(userId, oldPassword, newPassword) {
  const result = await PasswordModel.findOne({ userId: userId, password: oldPassword });
  if (result && mongoConverter(result)) {
    return PasswordModel.findOneAndUpdate({userId: userId}, {password: newPassword});
  }
  throw applicationException.new(applicationException.UNAUTHORIZED, 'Could not change the password');
}

export default {
  createOrUpdate: createOrUpdate,
  authorize: authorize,
  changePassword: changePassword,

  model: PasswordModel
};
