const jwt = require('jsonwebtoken');
const { UnautorizedError } = require('../helpers/UnautorizedError');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new UnautorizedError('Необходима авторизация');
    }

    const { NODE_ENV, JWT_SECRET } = process.env;

    const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
    req.user = payload;
  } catch (err) {
    return next(new UnautorizedError('Необходима авторизация'));
  }

  return next();
};
