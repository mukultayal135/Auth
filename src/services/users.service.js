const bcrypt = require('bcryptjs');
const { Users } = require('../models');
const HTTPError = require('../errors/HTTPError');
const tokenUtils = require('../utils/jwtUtils');
const redisUtils = require('../utils/redisUtil');

const createUser = async (email, password) => {
  const findUser = await Users.findOne({ where: { email } });
  if (findUser) {
    throw new HTTPError('User already exists', 409);
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await Users.create({
    email,
    password: hashedPassword,
  });
  return user;
};

const loginUser = async (email, password) => {
  const user = await Users.findOne({ where: { email } });

  if (!user) throw new HTTPError('User not found', 401);
  const isPasswordCorect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorect) throw new HTTPError('Invalid password', 401);
  const token = tokenUtils.generateToken(user);
  await redisUtils.storeToken(token);
  return token;
};

module.exports = { createUser, loginUser };
