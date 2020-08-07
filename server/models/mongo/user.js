const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const util = require('util');
const pbkd2Async = util.promisify(crypto.pbkdf2);
const SALT = require('../../cipher').PASSWORD_SALT;
const Errors = require('../../errors');

const UserSchema = new Schema({
  name: {type: String, required: true},
  nickname: {type: String, required: true},
  sex: String,
  age: {type: Number, max: [90, 'Nobody over 90 would use this website']},
  phone: String,
  username: {type: String, unique: true},
  password: String,
  avatar: String,
  level: Number,
  number: String,
  openId: {type: String},
  unionId: {type: String},
  status: {type: Number, default: 0},
});

const UserModel = mongoose.model('user', UserSchema);

// 创建用户
async function createNewUser(params) {
  const {
    name,
    password,
    age,
    phone,
    username,
    nickname,
    sex,
    level,
    number,
    avatar,
    openId,
    unionId,
  } = params;

  const user = new UserModel({
    name,
    username,
    nickname,
    sex,
    age,
    phone,
    avatar,
    level,
    number,
    openId,
    unionId,
  })

  if(password) {
    user.password = await pbkd2Async(password, SALT, 512, 128, 'sha1')
      .then(r => r.toString())
      .catch(e => {
        console.log(e);
        throw new Errors.InternalError('内部错误');
      })
  }

  let created = await user.save()
    .catch(e => {
      console.log(e)
      switch(e.code) {
        case 11000:
          throw new Errors.DuplicateUserNameError(params.name);
        default:
          throw new Errors.ValidationError('user', `创建用户出错${JSON.stringify(params)}`);
      }
    });
  
  return {
    _id: created._id,
    username: created.username,
    name: created.name,
    age: created.age,
    nickname: created.nickname,
    sex: created.sex,
    phone: created.phone,
    avatar: created.avatar,
    level: created.level,
    number: created.number,
    openId: created.openId,
    unionId: created.unionId,
  }
}

// 条件查询多个用户
async function getrUsers(params = { page: 0, pageSize: 0 }) {
  let flow = UserModel.find({});
  flow.skip(params.page * params.pageSize)
  flow.limit(params.pageSize)
  return await flow
    .catch(e => {
      console.log(e);
      throw new Error(`error getting users from db`);
    })
}

// 根据_id查询用户
async function getUserById(userId) {
  return await UserModel.findOne({ _id: userId })
    .catch(e => {
      console.log(e);
      throw new Error(`error getting user by id: ${userId}`);
    })
}

// 修改某用户
async function updateUserById(userId, update) {
  return await UserModel.findOneAndUpdate({ _id: userId }, update, {new: true})
    .catch(e => {
      console.log(e);
      throw new Error(`error updating user by id: ${userId}`)
    })
}

// 登录
async function login(username, password) {
  console.log('User.lgin', username, password)
  password = await pbkd2Async(password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e => {
      console.log(e);
      throw new Error('内部错误');
    })
  console.log('password-new', password)
  const user = await UserModel.findOne({ phone: username, password })
    .catch(e => {
      console.log(`error login in, phone ${username}`, {err: e.stack || e});
    });
  if(!user) throw new Errors.LoginError('no such user');
  console.log('User.login.user', user)
  return {
    _id: user._id,
    phone: user.phone,
    name: user.name,
    nickname: user.nickname,
    age: user.age,
  }
}

module.exports = {
  model: UserModel,
  createNewUser,
  updateUserById,
  getrUsers,
  getUserById,
  login,
}