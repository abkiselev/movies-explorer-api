const Movie = require('../models/movie');
const { BadRequestError } = require('../helpers/BadRequestError');
const { NotFoundError } = require('../helpers/NotFoundError');
const { ForbiddenError } = require('../helpers/ForbiddenError');
const { CREATED_CODE } = require('../helpers/codes');

module.exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    return res.send({ data: movies });
  } catch (error) {
    return next(error);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const owner = req.user._id;

    const movie = await Movie.create({ ...req.body, owner });
    return res.status(CREATED_CODE).send({ data: movie });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные для создания фильма'));
    }
    return next(error);
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    const owner = req.user._id;

    if (!movie) {
      throw new NotFoundError('Фильм с указанным _id не найден');
    }

    if (movie.owner.toString() !== owner) {
      throw new ForbiddenError('Не достаточно прав для удаления');
    }

    await movie.remove();

    return res.send({ message: 'Фильм удален' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new BadRequestError('Неверный формат ID'));
    }
    return next(error);
  }
};
