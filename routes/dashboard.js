var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/keys').MongoURI;
var router = express.Router();

var User = require('../models/user');

router.get('/add-friend', (req, res) => {
    res.render('add-friend', {
        friends: req.user.friends
    });
});

router.post('/add-friend', (req, res) => {
    MongoClient.connect(url, (err, db) => {
        var dbo = db.db('test');
        var query = { name: req.body.name };
        dbo.collection('users').find({ name: { $regex: new RegExp('^' + req.body.name, 'i') } }).toArray((err, friends) => {
            if (err) throw err
            var trueFriends = []
            for (var i = 0; i < friends.length; i++) {
                if (friends[i].name != req.user.name) {
                    trueFriends.push(friends[i])
                }
            }
            res.render('add-friend', {
                trueFriends
            }
            );
        })
    })
})

router.post('/add-new-friend', (req, res) => {
    var currFriends = req.user.friends;
    console.log(req.body.formData.email)
    currFriends.push(req.body.formData.email)
    res.redirect('/')
})



module.exports = router;