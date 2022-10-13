const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routes = require('./routes');
const { handleErrors } = require('./middlewares/handleErrors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(
  process.env.NODE_ENV === 'production' 
  ? process.env.MONGO_URI 
  : 'mongodb://localhost:27017/moviesdb', 
  {
  useNewUrlParser: true,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter)

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, (err) => {
  if (err) {
    console.log('Ошибка при запуске', ...err);
  }
  console.log(`Сервер запущен на порту ${PORT}`);
});
