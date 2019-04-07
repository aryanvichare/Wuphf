var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = require('../config/keys').MongoURI;
var { ensureAuthenticated } = require('../config/auth');
router.get('/', (req, res) => {
    res.render('home-page');
});

router.get('/dashboard', (req, res) => {
    var friendObjects = [];
    MongoClient.connect(url, (err, db) => {
        var dbo = db.db('test');

        // var col = dbo.collection('users').findOne({})
        // var arr = Array.from(col)
        // console.log(col);
        // arr.forEach(element => {
        //     if(req.user.friends.includes(element.email)){
        //         friendObjects.push(element);
        //     }
        // });
        // console.log(friendObjects);

        req.user.friends.forEach(friend => {
            dbo.collection('users').findOne({ email: friend }, (err, result) => {
                if(err) throw err
                var object = result;
                friendObjects.push(object);
            })
        });

            console.log(friendObjects)
        //console.log(friendObjects);

    })
    res.render('dashboard', {
        name: req.user.name,
        phone: req.user.phone,
        email: req.user.email,
        friends: friendObjects
    });

});



module.exports = router;