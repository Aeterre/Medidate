// Validate
// TODO Use a better date for calendar entries, like "yyyy/mm/dd"
// TODO Get calendar with signup or fill an empty calendar on signup (or return empty if calendar not present)

var process = require("process");

var config = null;
if (process.env.NODE_ENV == 'production') {
  config = require('./config.production.json');
} else {
  console.log("WARNING: Server running in development mode.");
  config = require('./config.development.json');
}

// --- Express
var express = require('express');
var app = express();

app.use(require('body-parser').json());
app.use(require('morgan')('tiny'));
app.use(require('express-session')({
  secret: config.secret.session, cookie: {}
}));

// TODO Move static files to /public
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/square.html');
});
app.get('/square.js',  function (req, res) {
  res.sendFile(__dirname + '/square.js');
});
app.get('/square.css', function (req, res) {
  res.sendFile(__dirname + '/square.css');
});
app.get('/calendar.js', function (req, res) {
  res.sendFile(__dirname + '/calendar.js');
});


// --- Mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/validate');

var userSchema = mongoose.Schema({
  email:    String,
  password: String,
});

var daySchema  = mongoose.Schema({
  entries: [String],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var User = mongoose.model('User', userSchema);
var Day  = mongoose.model('Day',  daySchema );


// --- Routes
app.post('/login',  function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return console.log(err);

    if (user && user.password == req.body.password) {
      Day.find({user_id: user.id}, function (err, days) {
        req.session.logged  = true;
        req.session.user_id = user._id;
        res.json({
          user: user,
          days: days.map(d => d.entries)
        });
      });
    } else if (user) {
      res.status(401).json();
    } else {
      res.status(404).json();
    }
  });
});

app.post('/signup', function (req, res) {
  var user = new User({
    email: req.body.email,
    password: req.body.password
  });

  user.save(function (err) {
    if (err) return console.log(err);
    req.session.logged  = true;
    req.session.user_id = user._id;
    res.json(user);
  });
});

app.post('/update', function (req, res) {
  console.log(req.session.user_id);
  User.findOne({ _id: req.session.user_id }, function (err, user) {
    if (err) return console.log(err);

    if (user) {
      for (i = 0; i < 7; i++) {
        Day.update({
          day_index:  i,
          user_id:    user._id,
        }, {
          entries:    req.body.days[i],
          day_index:  i,
          user_id:    user._id,
        }, { upsert: true }, function (err, day) {
          if (err) return console.log(err);
          console.log("saved", day);
        });
      }
      res.status(200).json(user);
    } else {
      res.status(401).json();
    }
  });
});

app.get('/reset', function (req, res) {
  MongoClient.connect(mongo_url, function (err, db) {
    if (err) return console.log(err)

    db.collection('users').remove();
  });
});

app.listen(3000, function () {
    console.log('Listening on port 3000!');
});
