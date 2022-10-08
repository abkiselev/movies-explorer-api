const jwt = require('jsonwebtoken');
const { UnautorizedError } = require('../helpers/UnautorizedError');

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      throw new UnautorizedError('Необходима авторизация');
    }

    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
  } catch (err) {
    return next(new UnautorizedError('Необходима авторизация'));
  }

  return next();
};
