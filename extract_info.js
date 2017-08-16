module.exports = function(jsonPath, items = null) {

    let JsonDB = require('node-json-db');
    let db = new JsonDB(jsonPath, true, true);

    /*
     * Use default item list if none is passed
     * */
    if (typeof items !== 'object' || items === null) {
        items = {

            'iurlsd': '/iurlsd',
            'author': '/author',
            'videoId': '/video_id',
            'formats': '/formats',
            'videoUrl': '/video_url',

        };
    }

    let resp = {};
    for (let key in items) {
        if (items.hasOwnProperty(key)) {
            resp[key] = db.getData(items[key]);
        }
    }
    console.log()

    return resp;
};