const express = require('express');
const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('./middlewares');
const { createToken, tokenTest, getMyPosts } = require('../controllers/v1');
const cors = require('cors');

const router = express.Router();

router.use(corsWhenDomainMatches); // CORS 미들웨어 추가



// apiLimiter 추가
router.post('/token', apiLimiter,createToken);  
router.get('/test', verifyToken, apiLimiter, tokenTest);

router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
router.get('/posts/hashtag/:hashtag', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;
