const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./error-handler');
require('dotenv').config();

const app = express();
const { PORT = 2022 } = process.env;

if (process.env.NODE_ENV !== 'production') {
  process.env.DATABASE = 'mongodb://localhost:27017/moviesbd';
} else if (!process.env.DATABASE) {
  throw new Error('Не указана база данных');
}

// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://front-kinomovie.nomorepartiesxyz.ru',
  'http://front-kinomovie.nomorepartiesxyz.ru',
  'http://localhost:3000',
];

app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // проверяем, что источник запроса есть среди разрешённых

  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  const requestHeaders = req.headers['access-control-request-headers'];
  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
});

app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(router);

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(errorLogger);
app.use(errors());

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => { });
} else if (process.env.JWT_SECRET) {
  app.listen(PORT, () => { });
} else {
  throw new Error('Токен не указан');
}
