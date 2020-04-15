const express = require('express');
const { check, validationResult } = require('express-validator/check');

const { insert } = require('./db');

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

const router = express.Router();

// Fylki af öllum validations fyrir umsókn
const validations = [
  check('name')
    .isLength({ min: 2 })
    .withMessage('Name has to be at least 2 letters long'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('email can\'t be empty'),

  check('email')
    .isEmail()
    .withMessage('Not valid email'),

  check('phone')
    .matches(/^[0-9]{3}( |-)?[0-9]{4}$/)
    .withMessage('Phone number has to be 7 digits long'),

  check('text')
    .isLength({ min: 20 })
    .withMessage('About has to be at least 20 letters long'),
];

/**
 * Route handler for the signup form.
 *
 * @param {object} req Request object
 * @param {object} res Response object
 * @returns {string}
 */
function form(req, res) {
  const data = {
    title: 'User',
    name: '',
    email: '',
    phone: '',
    text: '',
    errors: [],
  };
  res.render('form', data);
}

/**
 * Route handler sem athugar stöðu á umsókn og birtir villur ef einhverjar,
 * sendir annars áfram í næsta middleware.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @param {function} next Næsta middleware
 * @returns Næsta middleware ef í lagi, annars síðu með villum
 */
function showErrors(req, res, next) {
  const {
    body: {
      name = '',
      email = '',
      phone = '',
      text = '',
    } = {},
  } = req.autosan.body;

  const data = {
    name,
    email,
    phone,
    text,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    const errors = validation.array();
    data.errors = errors;
    data.title = 'User not valid';

    return res.render('form', data);
  }

  return next();
}

/**
 * Ósamstilltur route handler sem vistar gögn í gagnagrunn og sendir
 * á þakkarsíðu
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
async function formPost(req, res) {
  const {
    body: {
      name = '',
      email = '',
      phone = '',
      text = '',
    } = {},
  } = req.autosan.body;

  const data = {
    name,
    email,
    phone,
    text,
  };

  await insert(data);

  return res.redirect('/thanks');
}

/**
 * Route handler fyrir þakkarsíðu.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 */
function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir umsóknina' });
}

router.get('/', form);
router.get('/thanks', thanks);

router.post(
  '/',
  // Athugar hvort form sé í lagi
  validations,
  // Ef form er ekki í lagi, birtir upplýsingar um það
  showErrors,
  // Senda gögn í gagnagrunn
  catchErrors(formPost),
);

module.exports = router;
