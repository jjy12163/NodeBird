const express = require('express');
const { searchByHashtag, getMyPosts } = require('../controllers/v1');
const router = express.Router();

router.get('/myposts', getMyPosts);
router.post('/search/:hashtag', searchByHashtag);

module.exports = router;




