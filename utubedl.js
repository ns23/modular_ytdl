/*jshint esversion: 6 */
"use strict";

module.exports = function () {
    const URl = require("url");
    const ytdl = require("ytdl-core");
    const path = require('path');
    const fs = require('fs');

    /*
    * input:url(string)-url of youtube video or playlist
    * output:response(object)-type of url,& url
    * */
    let parseUrl = function (url) {
        let parsedUrl = URl.parse(url, true);

        let video = parsedUrl.query.v;
        let playlist = parsedUrl.query.list;

        let response = {url: url,};

        if (video && playlist) {
            response.format = 'vp';
        }
        else if (video) {
            response.format = 'v';
        }
        else if (playlist) {
            response.format = 'p';
        }
        else {
            response.format = null;
        }

        return response;
    };


    /*
    * Input:v(videoId string):example:7wNb0pHyGuI
    * Output:true /false
    * */

    let validateId = function (v) {
        return ytdl.validateId(v);
    };


    /*
    * Input:v(Video id)(type:string)example:7wNb0pHyGuI
    * Output:return a promise
    * */
    let getVideoInfo = function (v) {

        return new Promise((resolve, reject) => {
            ytdl.getInfo(v, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });

    };

    /*
    * Save video information to json
    * */
    let saveVideoToJson = function (v) {

        return new Promise((resolve, reject) => {
            ytdl.getInfo(v, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    let filepath = path.resolve(__dirname , v + '.json');
                    jsonToFile(filepath,JSON.stringify(info))
                    resolve(v);
                }
            });
        });


    };

    let jsonToFile = function (filepath, json) {
        fs.writeFileSync(filepath, json, {flag: "w"}, err => {
            if (err) throw err; //use this to display any errror durning getting info
            console.log('data written to file');
        });
    }


    return {
        parseUrl: parseUrl,
        validateId: validateId,
        getVideoInfo: getVideoInfo,
        saveVideoToJson:saveVideoToJson

    };
};