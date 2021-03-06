'use strict';

module.exports = function(config, cb) {


    const path = require('path');
    const fs = require('fs');
    const ytdl = require('ytdl-core');
    const url = config.videoUrl;
    const output = path.resolve(__dirname, 'video.mp4');
    const video = ytdl(url);

    function deletefile() {
        fs.unlink(path.resolve(__dirname, config.videoId + '.json'), function(err) {
            if (err) {
                throw err;
            }

            console.log('json file deleted');
        });
    }

    let starttime;
    video.pipe(fs.createWriteStream(output));
    video.once('response', () => {
        starttime = Date.now();
    });

    let response = null;

    video.on('progress', (chunkLength, downloaded, total) => {
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        response = {
            'percentage': (floatDownloaded * 100).toFixed(2),
            'downlaoded': (downloaded / 1024 / 1024).toFixed(2),
            'total': (total / 1024 / 1024).toFixed(2),
            'timeRemaining': (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2),
            'timeDone': downloadedMinutes.toFixed(2),
            'config': config,

        };
        cb(response);

        //pass this response object to view
    });

    video.on('end', (videoCount = config.videoCount) => {
        // deletefile();
        // cb(videoCount);
    });



    return {
        getRespone: getRespone,
    }

};