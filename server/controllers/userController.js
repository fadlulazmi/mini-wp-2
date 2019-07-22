const User = require('../models/user')
const Helper = require('../helpers/helper')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class UserController {
    
    static register(req, res, next) {   
        console.log('sampe register controller')     
        // console.log(req)
        const {username, email, password} = req.body

        User.create({
            username, email, password
        })
        .then(user=> {
            console.log('masuk server dan then')
            res.status(201).json(user)
        })
        .catch(err => {
            console.log(err)
            if (err.errors.email) {
                next({code: 400, msg: err.errors.email.reason });
            } else if(err.errors.password) {
                next({code: 400, msg: err.errors.password.message });
            } else {
                next(err);
            }
        })
    }

    static login(req, res, next) {
        console.log('sampe login controller')
        // const {email, password} = req.body
        console.log(req.body)
        User.findOne({
            email : req.body.email
        })
        .then(user => {
            console.log('masuk then', user)
            if(!user) {
                next({code: 404, msg: "Username/Password wrong" });
            } else {
                if( Helper.comparePassword(req.body.password, user.password) ) {
                    
                    let access_token = Helper.generateJWT({
                        email: user.email,
                        username: user.username,
                        id: user._id
                    });

                    res.status(200).json({access_token, userId: user._id, username : user.username, email: user.email})
                }else{
                    
                    next({code: 404, msg: "Username/Password wrong" });
                }
            }
        })
        .catch(next)
    }

    static loginGoogle(req, res, next) {
        let newEmail = ''
        let newName = ''

        client.verifyIdToken({
                idToken: req.headers.access_token,
                audience: process.env.GOOGLE_CLIENT_ID
            })
            .then(function(ticket) {
                newEmail = ticket.getPayload().email
                newName = ticket.getPayload().name
                return User.findOne({
                    email: newEmail
                })
            })
            .then(function(userLogin) {
                if (!userLogin) {
                    return User.create({
                        username: newName,
                        email: newEmail,
                        password: 'password'
                    })
                } else {
                    return userLogin
                }
            })
            .then(function(newUser) {
                let access_token = Helper.generateJWT({
                    email: newUser.email,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    id: newUser._id
                });

                res.status(200).json({access_token, userId : newUser._id, email: newUser.email, username: newUser.username})
            })
            .catch(next)
    }

    static async list(req, res, next) {
        try {
            let alluser = await User.find({
                _id : {
                    $not : {
                        $in : req.loggedUser._id
                    }
                }
            })
            .populate('followers')
            .populate('following')
            
            console.log('alluser: ', alluser);
            res.json(alluser)

        } catch (error) {
            console.log('error: ', error);
            next(error)
        }
        
    }

    static findOne(req, res, next) {
        const id = req.params.id ? req.params.id : req.headers.id

        User
        .findById(id)
        .populate('followers')
        .populate('following')
        .then(user => {
            res.status(200).json(user)
        })
        .catch(next)
    }

    static delete(req, res, next) {
        User
        .findByIdAndDelete(req.params.id)
        .then(user => {
            res.status(200).json(user)
        })
        .catch(next)
    }

    static async update(req, res, next){
        try {

            let obj = {}

            req.body.username && (obj.username = req.body.username)  
            req.body.following && (obj.following = req.body.following)
            req.body.followers && (obj.followers = req.body.followers)

            let updateUser = await User.findByIdAndUpdate(req.loggedUser._id, obj)

            res.json({msg: 'successfully updated', response: updateUser})
            
        } catch (error) {
            next(error)
        }
    }
    static async follow(req, res, next){
        try {
            console.log('req.body.id: ', req.params.id);
            let newFollow = await User.findById(req.params.id)
            console.log('newFollow: ', newFollow);

            newFollow.followers.push(req.loggedUser._id)

            let saving = await newFollow.save()

            console.log('saving: ', saving);

            let myAccount = await User.findById(req.loggedUser._id)

            myAccount.following.push(req.params.id)

            saving = await myAccount.save()
            
            console.log('saving: ', saving);

            res.json({msg: 'Follow success'})

        } catch (error) {
            next(error)
        }
    }

    static async unfollow(req, res, next){
        try {
            let newFollow = await User.findByIdAndUpdate(req.params.id, {
                $pull : {
                    followers : {
                        $in : req.loggedUser._id
                    }
                }
            })

            console.log('newFollow: ', newFollow);

            newFollow = await User.findByIdAndUpdate(req.loggedUser._id, {
                $pull : {
                    following : {
                        $in : req.params.id
                    }
                }
            })

            console.log('newFollow: ', newFollow);

            res.json({msg: 'unFollow success'})
            
        } catch (error) {
            next(error)
        }
    }
}

module.exports = UserController

