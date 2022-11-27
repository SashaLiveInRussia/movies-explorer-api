const bcrypt = require('bcryptjs');
const User = require('../models/user');

const { getJwtToken } = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const getUserInfo = (req, res, next) => {
  const { id } = req.user;

  User.findById(id)
    .orFail(() => next(new NotFoundError('Пользователь по указанному id не найден')))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
    }))
    .catch(next);
}; // возвращает информацию о пользователе

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user.id,
    { ...req.body },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такая запись уже существует'));
      }

      return next(err);
    });
}; //  обновляет информацию о пользователе

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .orFail(() => next(new AuthError('Неправильная почта или пароль')))
    .then((user) => bcrypt.compare(password, user.password, (err, isValidPassword) => {
      if (!isValidPassword) {
        return next(new AuthError('Неправильный email или пароль'));
      }

      const token = getJwtToken(user.id);
      return res.status(200).send({ token, email: user.email, name: user.name });
    }))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { password } = req.body;

  return bcrypt.hash(password, 10).then((hash) => User.create({ ...req.body, password: hash })
    .then((userData) => {
      const token = getJwtToken(user.id);
      res.status(201).json({ token, email: userData.email, name: userData.name });
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такая запись уже существует'));
      }

      return next(err);
    });
}; // создает пользователя

module.exports = {
  getUserInfo,
  createUser,
  updateUser,
  loginUser,
};
