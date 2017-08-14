/*jshint esversion: 6 */
"use strict";

let utube = require("./utubedl");
let extractInfo = require("./extract_info");
let yt = require("./download_video");

let downloadQueue = new Array()

let x = new utube();
x.saveVideoToJson('QjxScn7cKo8').then(function (res) {
        let info = extractInfo(res);
        downloadQueue.push(new yt(info));

    }
);

console.log('download queue is-----------------');
console.log(downloadQueue);
