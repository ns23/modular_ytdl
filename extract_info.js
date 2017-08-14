/*jshint esversion: 6 */
"use strict";


module.exports = function (jsonPath) {

    var JsonDB = require('node-json-db');
    var db = new JsonDB(jsonPath, true, true);


    var items = {

        'iurlsd': '/iurlsd',
        'author': '/author',
        'videoId': '/video_id',
        'formats': '/formats',
        'videoUrl':'/video_url',
    };

    let resp = {};
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            resp[key] = db.getData(items[key]);
        }
    }

    return resp;
};