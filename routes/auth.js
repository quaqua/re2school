const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../lib/auth_helpers')
const crypto = require('crypto')
const moment = require('moment')

// const getHashedPassword = (password) => {
//     const sha256 = crypto.createHash('sha256')
//     const hash = sha256.update(password).digest('base64')
//     return hash
// }

const generateAuthToken = () => crypto.randomBytes(30).toString('hex')

router.post('/',
  checkPassword,
  function(req, res) {
    if (req.authenticated) return res.redirect('/sheets')

    res.render('index', { title: 'Bienenklasse', bodyClass: 'auth', error: 'Falsches Passwort!' });
  })

router.get('/logout',
  clearSession,
  function(req,res) {
    res.redirect('/')
  })

function clearSession (req, res, next) {
  res.clearCookie('AuthToken')
  next()
}

function checkPassword (req, res, next) {
  const pwd = req.body.password
  if (pwd !== process.env.PASSWD) return next()

  req.authenticated = true
  res.cookie('AuthToken', generateAuthToken(), { expire: moment().add(30, 'd')})
  next();
}
module.exports = router
