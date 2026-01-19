const { User, Domain } = require('../models');
const { v4 :uuvidv4 } = require('uuid');

exports.renderLogin = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user?.id || null }, include: { model: Domain } });
        res.render('login', {
            user,
            domains: user?.Domains,
        })
    } catch (error) {
        console.error(error);
        next(error);
    }
};
exports.createDomain = async (req, res, next) => {
    try {
        const { host, type } = req.body;
        await Domain.create({
            host,
            type,
            clientSecret: uuid.v4(),
            UserId: req.user.id,
            clientSecret: uuid.v4(),
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
};




