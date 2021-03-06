'use strict';
const router = require('express').Router();
module.exports = router;

const User = require('../../../db/models/user');
const Drawing = require('../../../db/models/drawing');
const Project = require('../../../db/models/project');


router.get('/:facebook_id', (req, res, next) => {
    User.findOne({
        where: { facebook_id: req.params.facebook_id },
        include: { model: Project }
    })
        .then(user => {
            return user.getProjects({ include: { model: Drawing }});
        })
        .then(projects => {
            let projectsArray = projects.map(project => project.dataValues);
            res.send(projectsArray);
        })
        .catch(next);
});


router.post('/favorite', (req, res, next) => {
    User.findById(req.body.userId)
        .then(user => {
            if (user.favorites.indexOf(req.body.projectId) == -1) {

                user.favorites = user.favorites.concat([+req.body.projectId]);
                // user.favorites.push(req.body.projectId);
                console.log('*************************\n\n', user.favorites);
                return user.save();
            }
        })
        .then(user => res.send(user))
        .catch(next);
} )


router.post('/register', function (req, res, next) {
    User.findOrCreate({
        where: {username: req.body.name, facebook_id: req.body.id}})
        .spread((createdUser, isCreated) => {
            // req.session.user = createdUser.dataValues;
            res.send({user: createdUser.dataValues, isCreated: isCreated});
        })
        .catch(next);
});


