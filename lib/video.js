/**
 * Manages uploading and streaming of video files.
 *
 * @module video
 */
'use strict';

var fs, uploadPath, supportedTypes, filePathName, uploadDBPath;

fs             = require('fs');
uploadPath     = __dirname + '/../videos';
uploadDBPath    = __dirname + '/../videosdb'
supportedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg'
];

module.exports = {
    list    : list,
    deletelist : deletelist,
    deletevideo : deletevideo,
    request : request,
    upload  : upload
};

//_checkUploadDir();

/*function _checkUploadDir(cb) {
    cb = cb || function () {};

    fs.stat(uploadPath, function (err, stats) {
        if (
            (err && err.errno === 34) ||
            !stats.isDirectory()
           ) {
            // if there's no error, it means it's not a directory - remove it
            if (!err) {
                fs.unlinkSync(uploadPath);
            }

            // create directory
            fs.mkdir(uploadPath, cb);
            return;
        }

        cb();
    });
}

/**
 */
function list(stream, meta)  {
   // _checkUploadDir(function () {
        fs.readdir(uploadPath, function (err, files) {
            stream.write({ files : files });
           // console.log({ files : files });
            
        });
    //});
}

/**
 */

function deletelist(stream, meta)  {
  //  _checkUploadDir(function () {
        fs.readdir(uploadPath, function (err, files) {
            stream.write({ files : files });
           //console.log({ files : files });
            
        });
    //});
}


function request(client, meta) {
    var file = fs.createReadStream(uploadPath + '/' + meta.name);

    client.send(file);
}

function deletevideo(client, meta) {
    filePathName = ( meta.name );
    console.log("Going to delete an existing file");
    fs.unlink(uploadPath + '/' + meta.name, function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("File deleted successfully!");
   
   
});

    fs.unlink(uploadDBPath + '/' + meta.name, function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("File deleted successfully!");
   
   
});
  //MongoDB delete
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var conn = mongoose.createConnection(process.env.MONGOLAB_URI, function(err){
        if (err) console.err(err);
        else console.log('mongo connected');
    });
    
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    conn.once('open', function () {
    console.log('open');
    var gfs = Grid(conn.db);
   gfs.remove({
    filename: filePathName
    }, function (err) {
  if (err) return handleError(err);
  console.log('success');
});
    });
}
/**
 */
function upload(stream, meta) {
    if (!~supportedTypes.indexOf(meta.type)) {
        stream.write({ err: 'Unsupported type: ' + meta.type });
        stream.end();
        return;
    }

    var file = fs.createWriteStream(uploadPath + '/' + meta.name);
    stream.pipe(file);

    stream.on('data', function (data) {
        stream.write({ rx : data.length / meta.size });
    });

    stream.on('end', function () {
        stream.write({ end: true });
    });
        filePathName = ( meta.name );
    console.log(filePathName);
    //MongoDB
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var conn = mongoose.createConnection(process.env.MONGOLAB_URI, function(err){
        if (err) console.err(err);
        else console.log('mongo connected');
    });
    //var conn = mongoose.connection;
 
    //var fs = require('fs');
    var Grid = require('gridfs-stream');
    Grid.mongo = mongoose.mongo;
    conn.once('open', function () {
    console.log('open');
    var gfs = Grid(conn.db);
 
    // streaming to gridfs
    //filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: filePathName
    });
    
    fs.createReadStream('videos/'+ filePathName ).pipe(writestream);
  
    
    writestream.on('close', function (file) {
        // do something with `file`
        //write content to file system
var fs_write_stream = fs.createWriteStream('videosdb/'+ filePathName);
   console.log('reading from srii');
//read from mongodb
var readstream = gfs.createReadStream({
     filename: filePathName
});
readstream.pipe(fs_write_stream);
readstream.on('close', function () {
     console.log('file has been written fully!');
});
        
        console.log(file.filename + 'Written To DB');
    });
    
});      

}
