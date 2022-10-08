const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequestError } = require('../helpers/BadRequestError');
const { UnautorizedError } = require('../helpers/UnautorizedError');
const { NotFoundError } = require('../helpers/NotFoundError');
const { ConflictError } = require('../helpers/ConflictError');
const { CREATED_CODE } = require('../helpers/codes');

module.exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    return res.send({ data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ name, email, password: hash });
    return res.status(CREATED_CODE).send({
      data: {
        _id: user._id, name: user.name, email: user.email,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные для создания пользователя'));
    }
    if (error.code === 11000) {
      return next(new ConflictError('Такой пользователь уже существует'));
    }
    return next(error);
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, email } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }

    return res.send({ data: user });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return next(new BadRequestError('Неверный формат ID пользователя'));
    }
    if (error.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные для обновления пользователя'));
    }
    return next(error);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnautorizedError('Неправильные почта или пароль');
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      throw new UnautorizedError('Неправильные почта или пароль');
    }

    const { NODE_ENV, JWT_SECRET } = process.env;
    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
    return res.send({ token });
  } catch (error) {
    return next(error);
  }
};
