const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { urlRegExp } = require('../helpers/regExp');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().min(2).pattern(urlRegExp),
    trailerLink: Joi.string().required().min(2).pattern(urlRegExp),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().min(2).pattern(urlRegExp),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
