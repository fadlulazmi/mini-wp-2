const Helper = require('../helpers/helper')
const Article = require('../models/article')
const User = require('../models/user')

module.exports = {
    authenticate : (req, res, next) => {
        try {
            console.log(req.headers.access_token, 'ini token di middleware')
            const decoded = Helper.verifyJWT(req.headers.access_token);

            User.findById(decoded.id)
            .then(user => {
                if(user){
                    req.loggedUser = user
                    console.log(req.loggedUser)
                    next()
                } else {
                    next({code: 401, msg : 'not authorized'})
                }
            })
            
            
        } catch (err) {
            next(err)
        }

    },
    authorize : (req, res, next) => {
        Article.findById(req.params.id)
            .populate('userId')
            .then(data => {
                if(req.loggedUser.id == data.userId._id){
                    next()
                } else {
                    next({code: 401, msg : 'not authorized'})
                }
            })
            .catch(next)
        
    }
}