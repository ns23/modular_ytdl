/*jshint esversion: 6 */
"use strict";

letyoutubedl = function (configObject) {

    const path = require('path');
    const fs = require('fs');
    const ytdl = require("ytdl-core");

    const url = 'https://www.youtube.com/watch?v=WhXefyLs-uw';

    const output = path.resolve(__dirname, 'video.mp4');


    const video = ytdl(url);

    let starttime;
    video.pipe(fs.createWriteStream(output));
    video.once('response', () => {
        starttime = Date.now();
    });
    video.on('progress', (chunkLength, downloaded, total) => {
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - starttime) / 1000 / 60;
        let response = {
            "percentage": (floatDownloaded * 100).toFixed(2),
            "downlaoded": (downloaded / 1024 / 1024).toFixed(2),
            "total": (total / 1024 / 1024).toFixed(2),
            "timeRemaining": (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2),
            "timeDone": downloadedMinutes.toFixed(2),


        };

        console.log(response);
        //pass this response object to view
    });
    video.on('end', () => {
        process.stdout.write('\n\n');
    });

};
