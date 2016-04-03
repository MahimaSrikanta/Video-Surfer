$(document).ready(function () {
    var $video, $box, $progress, $list, $deletelist;

    $video    = $('#videoplay');
    $box      = $('#upload-box');
    $progress = $('#progress');
    $list     = $('#list');
    $deletelist    = $('#Deletelist');

    $video.attr({
        controls : true,
        autoplay : true
    });

    client.on('open', function () {
        video.list(setupList);
        video.deletelist(setupDeleteList);

        $box.on('dragenter', fizzle);
        $box.on('dragover', fizzle);
        $box.on('drop', setupDragDrop);
    });

    client.on('stream', function (stream) {
        video.download(stream, function (err, src) {
            $video.attr('src', src);
        });
    });

    function setupList(err, files) {
        var $ul, $li;

        $list.empty();
        $ul   = $('<ul>').appendTo($list);

        files.forEach(function (file) {
            $li = $('<li>').appendTo($ul);
            $a  = $('<a>').appendTo($li);

            $a.attr('href', '#').text(file).click(function (e) {
                fizzle(e);

                var name = $(this).text();
                video.request(name);
            });
        });
    }
    
    //function for deleting the video files
    function setupDeleteList(err, files){
       var $ul1, $li1;

        $deletelist.empty();
        $ul1   = $('<ul>').appendTo($deletelist);

        files.forEach(function (file) {
            $li1 = $('<li>').appendTo($ul1);
            $a1  = $('<a>').appendTo($li1);

            $a1.attr('href', '#').text(file).click(function (e) {
                fizzle(e);

                var name = $(this).text();
                video.deletevideo(name);
                //console.log('I am in main deletelist');
                       video.list(setupList);
             video.deletelist(setupDeleteList);
            });
        });
        
    }   

    function setupDragDrop(e) {
        fizzle(e);

        var file, tx;

        file = e.originalEvent.dataTransfer.files[0];
        tx   = 0;

        video.upload(file, function (err, data) {
            var msg;

            if (data.end) {
                msg = "Upload complete: " + file.name;

                video.list(setupList);
                video.deletelist(setupDeleteList);
            } else if (data.rx) {
                msg = Math.round(tx += data.rx * 100) + '% complete';

            } else {
                // assume error
                msg = data.err;
            }

            $progress.text(msg);
            
            if (data.end || data.err) {
                setTimeout(function () {
                    $progress.fadeOut(function () {
                        $progress.text('Drop file here');
                    }).fadeIn();
                }, 5000);
            }
        });
    }
});
