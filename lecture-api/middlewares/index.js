const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { Domain, User } = require('../models');

exports.isLoggedIn = (req, res, next) => { // 로그인 했는지 판단
  if (req.isAuthenticated()) {   //passport 통해서 로그인 했는지
        next();
    } else {
        res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => { // 로그인 안 했는지 판단
  if (!req.isAuthenticated()) {//passport 통해서 로그인 안했는지
        next();
    } else {
      const message = encodeURIComponent('로그인한 상태입니다.');
      res.redirect(`/?error=${message}`);
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    if(error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.',
    });
  }
}

exports.apiLimiter = async (req, res, next) => {
  let user;   // 사용자 없는 경우 대비
  if(res.locals.decoded.id) {
    user = await User.findOne({ where: { id: res.locals.decoded.id } });
  }
  rateLimit({
    windowMs: 60 * 1000, // 1분
    max: user?.type === 'premium' ? 1000 : 10, // 프리미엄 회원은 100, 일반 회원은 5
    handler(req, res) {
      return res.status(429).json({
        code: this.statusCode,
        message: '1분에 한 번만 요청할 수 있습니다.',
      });
    }
  })(req, res, next);
}

exports.deprecated = (req, res) => {   // v2로 업그레이드 안내 미들웨어
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
  });
}



exports.corsWhenDomainMatches = async (req, res, next) => {
  const domain = await Domain.findOne({
    where: { host: new URL(req.get('Origin')).host }
  });
  if (domain) {
    cors({ origin: req.get('Origin'), credentials: true })(req, res, next);
  } else {
    next();
  }
}