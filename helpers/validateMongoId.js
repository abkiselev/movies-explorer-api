const mongoose = require('mongoose');
const { Joi } = require('celebrate');

const validateId = (value, helpers) => {
  if (!mongoose.isObjectIdOrHexString(value)) {
    return helpers.message('Некорректный формат ID');
  }

  return value;
};

const isValidMongoId = {
  id: Joi.string().alphanum().length(24).custom(validateId, 'ObjectID validation'),
};

module.exports = {
  isValidMongoId,
};
