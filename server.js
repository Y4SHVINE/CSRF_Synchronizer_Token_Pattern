const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require("crypto");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3000;

const app = express();

app.set('views', path.join(__dirname, '/public'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/assets'));

app.use(session({
  name: 'sessionID',
  secret: 'SLIITSSDKt2HA454tYPW',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true }
}))
// Change cookie: { secure: true, httpOnly: true } when deploying to Production environment

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

// Views
app.get('/', function (req, res) {
  res.render('views/index', { msg: "", className: "" });
});
app.get('/form', function (req, res) {
  res.render('views/form');
});


app.get('/token', function (req, res) {
  res.json(req.session.csrf);
});

app.post('/login', function (req, res) {
  if (req.body.username == "ssd" && req.body.password == "ssd123") {
    res.cookie('username', req.body.username);

    let token = generateTocken();
    req.session.csrf = token;
    res.redirect('form');
  } else {
    res.render('views/index', {
      msg: 'Invalid credentials! Please use default username and password.',
      className: 'message-fail'
    });
  }
})

app.post('/formsubmit', function (req, res) {
  if (req.session.csrf == req.body._csrf) {
    res.render('views/message', {
      msgTxt: 'Contact details saved successfully!',
      reason: 'CSRF token is valid!',
      className: 'success'
    });
  } else {
    res.render('views/message', {
      msgTxt: 'Invalid Contact Data.',
      reason: 'Invalid CSRF Tocken !!!',
      className: 'fail'
    });
  }
})

var length = 50;
var timestamp = +new Date();
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTocken() {
  var ts = timestamp.toString();
  var parts = ts.split("").reverse();
  var id = "";
  for (var i = 0; i < length; ++i) {
    var index = getRandomInt(0, parts.length - 1);
    id += parts[index];
  }
  var createdTocken = crypto.createHash('sha256').update(id).digest('hex');
  return createdTocken;
}

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

