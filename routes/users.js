var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    var { name, email, password, password2, phone } = req.body;
    let friends = []
    let errors = []

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, email, password, password2, phone });
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push('Email is already registered')
                    res.render('register', { errors, name, email, password, password2, phone });
                } else {
                    var newUser = new User({ name, email, password, phone, friends });
                    bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                console.log(user)
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err));
                    }));
                }

            });
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login')
});

module.exports = router;