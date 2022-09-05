const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const userRouter = require('./users');
const movieRouter = require('./movies');
const { createUser, loginUser } = require('../controllers/users');
const { isAutorised } = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(8).required().strict(),
  }),
}), loginUser);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required().min(2).max(30),
    password: Joi.string().min(8).required().strict(),
  }),
}), createUser);

router.use(isAutorised);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
