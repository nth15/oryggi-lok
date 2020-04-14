// `dotenv` pakkinn sér um að gera gildi í `.env` aðgengileg í `process.env`
require('dotenv').config();

const path = require('path');
const express = require('express');

const signup = require('./signup');
const users = require('./users');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/**
 * Hjálparfall til að athuga hvort reitur sé gildur eða ekki.
 *
 * @param {string} field Middleware sem grípa á villur fyrir
 * @param {array} errors Fylki af villum frá express-validator pakkanum
 * @returns {boolean} `true` ef `field` er í `errors`, `false` annars
 */
function isInvalid(field, errors) {
  return Boolean(errors.find(i => i.param === field));
}

app.locals.isInvalid = isInvalid;

app.use('/', signup);
app.use('/users', users);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404', error: '404 not found' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', { title: 'Error', error });
}

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = 'https://herokuapp.com/' || '127.0.0.1';
const port = process.env.PORT || 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
