const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMe, updateUserInfo } = require('../controllers/users');

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
