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

// all environments
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



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
