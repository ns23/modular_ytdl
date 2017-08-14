/*jshint esversion: 6 */
"use strict";

var utube = require("./utubedl");
var extractInfo = require("./extract_info");

var x = new utube();
x.saveVideoToJson('yyd0rNyrlS8').then(function (res) {
        var info = extractInfo(res);

    }
);

// var info =  extractInfo();