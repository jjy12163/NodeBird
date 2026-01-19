const passport = require('passport');
const local = require('./localStrategy');   // localStrategy, kakaoStrategy 호출
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ 
      where: { id },
      include: [
        {
          model: User,      // 팔로잉
          attributes: ['id', 'nick'],
          as: 'Followers',
        }, {
          model: User,      // 팔로워
          attributes: ['id', 'nick'],
          as: 'Followings',
        }
      ],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local();
  kakao();
};