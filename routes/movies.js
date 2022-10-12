const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { urlRegExp } = require('../helpers/regExp');
const { isValidMongoId } = require('../helpers/validateMongoId');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegExp),
    trailerLink: Joi.string().required().pattern(urlRegExp),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(urlRegExp),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/:id', celebrate({
  params: Joi.object().keys(isValidMongoId).unknown(true),
}), deleteMovie);

module.exports = router;
