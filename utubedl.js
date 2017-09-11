/**
 * 
 * 
 * @returns 
 */
module.exports = function() {

    const URl = require('url');
    const ytdl = require('ytdl-core');
    const path = require('path');
    const fs = require('fs');
    const https = require('https');

    const apiKey = 'AIzaSyC3KtXoh7UskFX6EEqyo7xSygr4mmByn9k';
    /*
     * input:url(string)-url of youtube video or playlist
     * output:response(object)-type of url,& url
     * */
    let parseUrl = function(url) {
        let parsedUrl = URl.parse(url, true);

        let video = parsedUrl.query.v;
        let playlist = parsedUrl.query.list;

        let response = {
            link: url,
        };

        if (video && playlist) {
            response.isPlaylist = 'vp';
            response.videoId = video;
            response.playlistId = playlist;
        } else if (video) {
            response.isPlaylist = 'v';
            response.videoId = video;
        } else if (playlist) {
            response.isPlaylist = 'p';
            response.playlistId = playlist;
        } else {
            response.isPlaylist = null;
        }

        return response;
    };


    /*
     * Input:v(videoId string):example:7wNb0pHyGuI
     * Output:true /false
     * */

    let validateId = function(v) {
        return ytdl.validateId(v);
    };


    function extractFormats(data) {
        console.log(data.author);
    }


    /*
     * Input:v(Video id)(type:string)example:7wNb0pHyGuI
     * Output:return a promise
     * */
    let getVideoInfo = function(v) {

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
     * Converts a JSOn Object to file
     * */

    let jsonToFile = function(filepath, json) {
        fs.writeFileSync(filepath, json, {
            flag: 'w'
        }, err => {
            if (err) {
                throw err;
            } //use this to display any errror durning getting info
            console.log('data written to file');
        });
    };


    /*
     * Save video information to json
     * return filename(without extension)
     * */
    let saveVideoToJson = function(v) {

        return new Promise((resolve, reject) => {
            ytdl.getInfo(v, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    let filepath = path.resolve(__dirname, v + '.json');
                    jsonToFile(filepath, JSON.stringify(info));
                    resolve(v);
                }
            });
        });
    };



    /**
     * Builds a query string for making youtube API call
     *
     * @param {any} url
     * @param {any} params
     * @returns queryString
     */
    function buildQueryString(url, params) {
        let queryString = url + '?';

        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                queryString += key + '=' + params[key] + '&';
                queryString += (key === 'key') ? '' : '&';
            }
        }

        return queryString;
    }


    /**
     * Makes a get request to url
     *
     * @param {any} apiUrl
     * @returns a promise
     */
    function getRequest(apiUrl) {
        let parsed;
        return new Promise((resolve, reject) => {
            https.get(apiUrl, function(res) {
                    let body = ''; // Will contain the final response
                    // Received data is a buffer.
                    // Adding it to our body
                    res.on('data', function(data) {
                        body += data;

                    });
                    // After the response is completed, parse it and log it to the console
                    res.on('end', function() {
                        parsed = JSON.parse(body);
                        resolve(parsed);
                    });
                })
                // If any error has occured, log error to console
                .on('error', function(e) {
                    reject(e.message);
                    console.log('Got error: ' + e.message);
                });
        });

    }




    /**
     * Finds number of videos & videos
     * information in the playlist
     *
     * @param {any} id
     * @param {any} [pageToken=null]
     * @returns onject containing playlist information
     */
    function parsePlaylist(id, pageToken = null) {
        let result; //contains list of all vidos in playlist

        let apiUrl = 'https://www.googleapis.com/youtube/v3/playlistItems';
        let params = {
            'playlistId': id,
            'maxResults': 50,
            'pageToken': (pageToken == null) ? '' : pageToken,
            'part': 'snippet,contentDetails',
            'key': apiKey

        };

        let queryString = buildQueryString(apiUrl, params);

        let numOfReq = 1;

        return new Promise((resolve, reject) => {
            getRequest(queryString).then((res) => {
                if (numOfReq > 1) {

                    for (let myKey in res.items) {
                        if (res.items.hasOwnProperty(myKey)) {
                            result.items.push(res.items[myKey]);
                        }
                    }
                    numOfReq = numOfReq + 1;

                } else {
                    result = res;
                    resolve(result);
                }
                //till all videos are retrived
                if (res.hasOwnProperty('nextPageToken')) {
                    parsePlaylist(id, res.nextPageToken);
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });

    }

    /**
     * Get size of video based on itag,returns a callback
     * 
     * @param {any} [param=null] 
     * Respone is object containg sizes of video
     */
    let getVideoSize = function(param = null) {
        let vUrl = param.videoUrl;
        let itag = param.availableFormats;
        let response = {
            url: vUrl,
            videoSize: [],
        };

        let itemsProcessed = 0;

        itag.forEach(function(element) {
            let video = ytdl(vUrl, { filter: function(format) { return format.itag === element; } });
            video.once('progress', (chunkLength, downloaded, total) => {
                response.videoSize.push({ size: total, itag: element });
                video.emit('end');

            });

            video.on('end', () => {
                itemsProcessed = itemsProcessed + 1;
                if (itemsProcessed === itag.length) {
                    param.callback(response);
                }
            });

        });

    };

    /**
     * goes through format object and check if allowed itags are available in the format object
     * 
     * @param {any} formats 
     * @returns array of itags that are availabel and are supported
     */
    let getAvailableFormats = function(formats) {
        let SupportedItags = ['17', '18', '22', '36', '43'];
        let response = [];
        for (var key in formats) {
            if (formats.hasOwnProperty(key)) {
                var itag = formats[key].itag;
                if (SupportedItags.indexOf(itag) > -1) {
                    response.push(itag);
                }
            }
        }
        return response;
    }



    return {
        parseUrl: parseUrl,
        validateId: validateId,
        getVideoInfo: getVideoInfo,
        saveVideoToJson: saveVideoToJson,
        parsePlaylist: parsePlaylist,
        getVideoSize: getVideoSize,
        getAvailableFormats: getAvailableFormats,
    };
};