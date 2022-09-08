const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user.id })
    .then((movie) => res.send(movie))
    .catch(next);
}; // возвращает все сохранённые текущим  пользователем фильмы

const createMovie = (req, res, next) => {
  const movieData = req.body;
  const { id: owner } = req.user;

  Movie.create({ ...movieData, owner })
    .then((movie) => res.send({ data: movie }))
    .catch(next);
}; // создаёт карточку

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params.movieId })
    .select('+owner')
    .orFail(() => next(new NotFoundError('Карточка с указанным id не найдена')))
    .then((movie) => {
      if (!movie.owner.equals(req.user.id)) {
        return next(new ForbiddenError('Не наша карточка'));
      }

      return movie.remove()
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch(next);
}; // удаляет карточку по идентификатору

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
