/*jshint esversion: 6 */
"use strict";


module.exports = function (jsonPath) {

    var JsonDB = require('node-json-db');
    var db = new JsonDB(jsonPath, true, true);


    var items = {

        'iurlsd': '/iurlsd',
        'author': '/author',
        'video_id': '/video_id',
        'formats': '/formats',
    };

    let resp = {};
    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            console.log(key + " -> " + items[key]);
            resp[key] = db.getData(items[key]);
        }
    }

    console.log(resp);

    // console.log(data);

    return {};
};