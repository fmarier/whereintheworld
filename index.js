const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const https = require('https');
const qs = require('qs');

const DB_FILE = 'db.json';
const BROWSERID_AUDIENCE = 'http://localhost:3000';
const SESSION_SECRET = crypto.randomBytes(128) + '';

const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.cookieParser());
  app.use(express.session({ secret: SESSION_SECRET }));
  app.use(express.bodyParser());
  app.use(express.static(__dirname + '/public'));
});

function is_allowed(user) {
  if (db.acl.emails.indexOf(user) != -1) {
    return true;
  }
  var domain = user.replace(/^.*@/, '');
  if (db.acl.domains.indexOf(domain) != -1) {
    return true;
  }
  return false;
}

app.get('/', function (req, res) {
  var templateVars = {
    owner: db.owner,
    user: req.session.user
  };

  if (!req.session.user) {
    return res.status(401).render('login.ejs', templateVars);
  }
  if (!is_allowed(req.session.user)) {
    return res.status(401).render('not_allowed.ejs', templateVars);
  }

  templateVars.trips = db.trips;
  res.render('index.ejs', templateVars);
});

app.post('/login', function (req, res) {
    function onVerifyResp(verifierRes) {
      var data = "";
      verifierRes.on('data', function (chunk) {
        data += chunk;
      });

      verifierRes.on('end', function () {
        var verified = JSON.parse(data);
        if ('okay' == verified.status) {
          req.session.user = verified.email;
        } else {
          delete req.session.user;
        }
        res.send(verified.status);
      });
    };

    var body = qs.stringify({
      assertion: req.body.assertion,
      audience: BROWSERID_AUDIENCE
    });

    var request = https.request({
      host: 'verifier.login.persona.org',
      path: '/verify',
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'content-length': body.length
      }
    }, onVerifyResp);
    request.write(body);
    request.end();
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

app.listen(3000);
