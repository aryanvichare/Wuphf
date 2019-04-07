var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var path = require('path');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');

var db = require('./config/keys').MongoURI;
require('./config/passport')(passport)

mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB Started...'))
    .catch((err) => console.log(err))
  
var app = express();

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static(path.join(__dirname, "public")));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/dashboard', require('./routes/dashboard'));

var port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server Started on port ${port}`);
});