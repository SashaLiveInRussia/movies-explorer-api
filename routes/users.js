const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  updateUser, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo); // возвращает информацию о пользователе

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i).required(),
  }),
}), updateUser); // обновляет информацию о пользователе

module.exports = router;
