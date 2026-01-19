const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
    
});

router.get('/logout', isLoggedIn, (req, res) => {
    
});

router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/?error=카카오로그인 실패',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;