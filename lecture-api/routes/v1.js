const express = require('express');

const { verifyToken } = require('./middlewares');
const { createToken, tokenTest } = require('../controllers/v1');

const router = express.Router();

router.post('/token', createToken);   // 토큰 발급 라우터

router.get('/test', verifyToken, tokenTest);   // 토큰 테스트 라우터9

module.exports = router;