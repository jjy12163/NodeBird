const jwt = require('jsonwebtoken');
const { Domain, User, Hashtag, Post } = require('../models');

// 토큰 발급
// POST /v1/token
exports.createToken = async (req, res, next) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attributes: ['id', 'nick'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '1m',
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.',
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
};

// 토큰 테스트
// GET /v1/test
exports.testToken = (req, res) => {
    res.json(res.locals.decoded);
}

exports.getMyPosts = (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
      .then((posts) => {
        res.json({
            code: 200,
            payload: posts,
        });
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        })
      })
}

exports.getPostsByHashtag = async (req, res) => {
    try {
      const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });   // req.params.title로 해시태그 검색

        if (!hashtag) {  // 검색결과 없음 or 쓰인적 없는 해시태그
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();  // 해시태그로 게시글들 검색
        if(posts.length === 0) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
}