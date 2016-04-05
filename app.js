/**
 * File Uploading and Streaming with BinaryJS
 */
'use strict';

var BinaryServer, express, http, path, app, video, server, bs;

BinaryServer = require('binaryjs').BinaryServer;
express      = require('express');
http         = require('http');
path         = require('path');
app          = express();
video        = require('./lib/video');

//auth0
var passport = require('passport');

// This is the file we created in step 2.
// This will configure Passport to use Auth0
var strategy = require('./setup-passport');

// Session and cookies middlewares to keep user logged in
var cookieParser = require('cookie-parser');
var session = require('express-session');

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//Auth0
app.use(cookieParser());
// See express session docs for information on the options: https://github.com/expressjs/session
app.use(session({ secret: 'YOUR_SECRET_HERE', resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


//Auth0
// Auth0 callback handler
app.get('https://dry-thicket-81721.herokuapp.com/video.html',
  passport.authenticate('auth0', { failureRedirect: '/url-if-something-fails' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/user");
  });


//Auth0
app.get('/user', function (req, res) {
  res.render('user', {
    user: req.user
  });
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}




server = http.createServer(app);

bs = new BinaryServer({server: server});

bs.on('connection', function (client) {
    client.on('stream', function (stream, meta) {
        switch(meta.event) {
            // list available videos
            case 'list':
                video.list(stream, meta);
                break;
             //delete list
             case 'deletelist':  
                video.deletelist(stream,meta) ;
                break;
                    
            // request for a video
            case 'request':
                video.request(client, meta);
                break;
                
            // delete a video
            case 'deletevideo':
                video.deletevideo(client, meta);
                break;
            
            // attempt an upload
            case 'upload':
            //default:
                video.upload(stream, meta);
        }
    });
});

server.listen(process.env.PORT || 9000, function () {
    console.log('Video Server started on http://0.0.0.0:9000');
});
