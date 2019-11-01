const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const UserController = require('../controllers/users');

router.post('/signup', UserController.signup);

router.get('/:id', (req, res, next) => {
    User.findById(req.params.id).select('_id email password').exec()
    .then(doc => {
        res.status(200).json({
            _id : doc._id,
            email : doc.email,
            password : doc.password
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
});
        
router.post('/login', UserController.login);

router.get('/', (req, res, next) => {
    User.find().select('_id email password').exec()
    .then(docs => {
        if(docs.length){
            res.status(200).json(
                docs.map(doc => {
                    return {
                        _id : doc._id,
                        email : doc.email,
                        password : doc.password
                    }
                })
            );
        }
        else{
            res.status(409).json({
                message : 'User not available'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
});

router.delete('/:id', (req, res, next) => {
    User.remove({ _id : req.params.id }).exec()
    .then(result => {
        res.status(200).json({ message : "User deleted" });
    })
    .catch(err => {
        res.status(409).json({
            error : err
        });
    });
});

module.exports = router;