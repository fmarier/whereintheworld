#!/usr/bin/env node

// Where in the World
// Copyright (C) 2013  Francois Marier <francois@fmarier.org>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

const crypto = require('crypto');
const express = require('express');
const fs = require('fs');
const https = require('https');
const qs = require('qs');
const verify = require('browserid-verify')();

const DATA_DIR = process.env['DATA_DIR'] || '.';
const DB_FILE = DATA_DIR + '/db.json';
const AIRPORT_FILE = DATA_DIR + '/airports.json';
const BROWSERID_AUDIENCE = process.env['BROWSERID_AUDIENCE'] || 'http://localhost:3000';
const SESSION_SECRET = crypto.randomBytes(128) + '';

var db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));

// FIXME: dirty hacks to make these accessible within template functions :(
GLOBAL.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
GLOBAL.airports;
if (AIRPORT_FILE) {
  airports = JSON.parse(fs.readFileSync(AIRPORT_FILE, 'utf8'));
}

var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.cookieParser());
  app.disable('x-powered-by');
  app.use(express.session({ secret: SESSION_SECRET, key: 'sessionId' }));
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
  templateVars.airports = airports;
  res.render('index.ejs', templateVars);
});

app.post('/login', function (req, res) {
    verify(req.body.assertion, BROWSERID_AUDIENCE, function(err, email, response) {
      if (err) {
        return console.log('There was an error : ' + err);
      }

      if (email) {
        req.session.user = response.email;
      } else {
        delete req.session.user;
      }
      res.send(response.status);
    });
});

app.get('/logout', function (req, res) {
  delete req.session.user;
  res.redirect('/');
});

app.listen(process.env['PORT'] || 3000, '127.0.0.1');
console.log('Application available at ' + BROWSERID_AUDIENCE);
