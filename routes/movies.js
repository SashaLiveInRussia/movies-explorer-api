const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies); // возвращает все сохранённые текущим  пользователем фильмы

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z0-9]+)(\/[\w-.~:?#[\]@!$&'()*+,;=]+)*#?\/?$/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z0-9]+)(\/[\w-.~:?#[\]@!$&'()*+,;=]+)*#?\/?$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/([a-z0-9]{1})((\.[a-z0-9-])|([a-z0-9-]))*\.([a-z0-9]+)(\/[\w-.~:?#[\]@!$&'()*+,;=]+)*#?\/?$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie); // создаёт фильм

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie); // удаляет сохранённый фильм по id

module.exports = router;
