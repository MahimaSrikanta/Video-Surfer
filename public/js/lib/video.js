var video = (function () {
    return {
        list     : list,
        deletelist : deletelist,
        deletevideo : deletevideo,
        upload   : upload,
        request  : request,
        download : download
    };

    function list(cb) {
        var stream = emit('list');

        stream.on('data', function (data) {
            cb(null, data.files);
           console.log('list called');
        });

        stream.on('error', cb);
    }
    
    
       function deletelist(cb) {
        var stream = emit('deletelist');

        stream.on('data', function (data) {
            cb(null, data.files);
           console.log('deletelist called');
        });

        stream.on('error', cb);
    }

    function upload(file, cb) {
        var stream = emit('upload', {
            name  : file.name,
            size  : file.size,
            type  : file.type
        }, file);

        stream.on('data', function (data) {
            cb(null, data)
            console.log(data);
        });

        stream.on('error', cb);
    }

    function request(name) {
        emit('request', { name : name });
    }
    
     function deletevideo(name) {
        emit('deletevideo', { name : name });
    }
    
     

    function download(stream, cb) {
        var parts = [];

        stream.on('data', function (data) {
            parts.push(data);
        });

        stream.on('error', function (err) {
            cb(err);
        });

        stream.on('end', function () {
            var src = (window.URL || window.webkitURL).createObjectURL(new Blob(parts));

            cb(null, src);
        });
    }
})();
