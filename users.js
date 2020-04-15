const express = require('express');

const { select, search } = require('./db');

const router = express.Router();

/**
 * Higher-order fall sem umlykur async middleware með villumeðhöndlun.
 *
 * @param {function} fn Middleware sem grípa á villur fyrir
 * @returns {function} Middleware með villumeðhöndlun
 */
function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

/**
 * Ósamstilltur route handler fyrir umsóknarlista.
 *
 * @param {object} req Request hlutur
 * @param {object} res Response hlutur
 * @returns {string} Lista af umsóknum
 */
async function users(req, res) {
  const list = await select();

  const data = {
    title: 'Members',
    list,
  };

  return res.render('users', data);
}

function form(req, res) {
  const data = {
    title: 'Search users',
    param: '',
    errors: [],
  };
  res.render('search', data);
}

async function searchUsers(req, res) {
  const {
    body: {
      param = '',
    } = {},
  } = req.autosan.body;

  const list = await search(param);

  const data = {
    title: 'Members',
    list,
  };

  res.render('users', data);
}

//router.get('/', catchErrors(users));
router.get('/search', form);
router.get('/', catchErrors(searchUsers));

module.exports = router;
