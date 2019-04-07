var express = require('express');
var router = express.Router();
var { ensureAuthenticated } = require('../config/auth');

router.get('/', (req, res) => {
    res.render('home-page');
});

router.get('/dashboard', (req, res) => {
    res.render('dashboard', {
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email
    });
});



module.exports = router;