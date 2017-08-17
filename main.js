let Utube = require('./utubedl');
let extractInfo = require('./extract_info');
let yt = require('./download_video');

let downloadQueue = new Array();
let i = 0;


let x = new Utube();
// x.getVideoSize();

/* x.parsePlaylist('PL6gx4Cwl9DGDi9F_slcQK7knjtO8TUvUs').then(function(res) {
    console.log(res); //list of videos in youtue playlist
}).catch(function(error) {
    console.log(error);
});



function cb(params = null) {
    console.log('Video id is');
    console.log(params);
}
*/
let displayContent = function(param) {
    console.log("param");
    console.log(param);
}

x.saveVideoToJson('QjxScn7cKo8').then(function(res) {
    let info = extractInfo(res);
    // console.log(info);
    let availableFormats = x.getAvailableFormats(info.formats);
    let params = {
        availableFormats: availableFormats,
        videoUrl: info.videoUrl,
        callback: displayContent,
    }
    let videoSizes = x.getVideoSize(params);
    console.log(videoSizes);
    info.videoCount = i;

    i++;
    // downloadQueue.push(new yt(info, cb));


});