var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/keys').MongoURI;
var async = require('async');
var router = express.Router();

var User = require('../models/user');
var buddies;

router.get('/add-friend', (req, res) => {
    res.render('add-friend', {
        friends: req.user.friends
    });
});

router.post('/add-friend', (req, res) => {
    buddies = []
    MongoClient.connect(url, (err, db) => {
        var dbo = db.db('test');
        dbo.collection('users').find({ name: { $regex: new RegExp('^' + req.body.name, 'i') } }).toArray((err, friends) => {
            if (err) throw err
            var trueFriends = []
            for (var i = 0; i < friends.length; i++) {
                if (friends[i].name != req.user.name) {
                    trueFriends.push(friends[i])
                    buddies.push(friends[i])
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
    console.log('body: ' + JSON.stringify(req.body));
    var currFriends = req.user.friends;
    if(!currFriends.includes(req.body.friendEmail)){
    currFriends.push(req.body.friendEmail)
    
    
    MongoClient.connect(url, (err, db) => {
        var dbo = db.db('test');
        dbo.collection('users').update({email: req.user.email}, {$set: {friends:currFriends}}, (err, result) => {
            if(err) throw err
        })

        dbo.collection('users').findOne({email: req.body.friendEmail}, (err, result) => {
            var friendArr = result.friends;
            friendArr.push(req.user.email);
            dbo.collection('users').update({email: req.body.friendEmail},{$set: {friends:friendArr}}, (err, result) => {
                if(err) throw err
            })
        })

    })
}
})



module.exports = router;