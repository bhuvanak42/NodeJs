const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) =>{
        if(err){
            res.status(409).json({
                error : err
            });
        }
        else{
            const user = new User({
                _id : new mongoose.Types.ObjectId(),
                email : req.body.email,
                password : hash
            }); 
            user.save()
            .then(result => {
                res.status(201).json({
                    message : 'User created',
                    _id : user._id,
                    email : user.email,
                    password : user.password
                });
            })
            .catch(err => {
                res.status(500).json({
                    error : err
                });
            });
        }
    });
};

exports.login =  (req, res, next) => {
    const user = User.findOne({ email : req.body.email }).exec()
    .then(
        user => {
            if(user){
                bcrypt.compare( req.body.password, user.password, (err, result) => {
                    if(result){
                        const token = jwt.sign({
                            email : user.email,
                            userId : user._id
                        }, "secretPassword", {
                            expiresIn : "1d"
                        });
                        return res.status(200).json({
                            message : 'Auth successful',
                            token : token
                        });
                    }
                    return res.status(404).json({
                        message : 'Auth failed'
                    });
                });
            }
            else{
                res.status(404).json({
                    message : 'User not found'
                });
            }
        }
    )
    .catch( err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    } );
};