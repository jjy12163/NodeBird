const Sequelize = require('sequelize');

class Post extends Sequelize.Model {

    static initiate(sequelize) {
        Post.init({
            content: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            img: {    // 글 1개당 이미지 1개
                type: Sequelize.STRING(200),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            paranoid: false,
            modelName: 'Post',
            tableName: 'posts',
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci'
        })
    }

    static associate(db) {
        db.Post.belongsTo(db.User);   // N:1  게시글:유저
        
        // N:M  게시글:해시태그,
        db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });

    }
}

module.exports = Post;
