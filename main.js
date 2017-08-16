let Utube = require('./utubedl');
let extractInfo = require('./extract_info');
let yt = require('./download_video');

let downloadQueue = new Array();
let i = 0;

let x = new Utube();
x.parsePlaylist('PL6gx4Cwl9DGDi9F_slcQK7knjtO8TUvUs').then(function(res) {
    console.log(res); //list of videos in youtue playlist
}).catch(function(error) {
    console.log(error);
});



/* function cb(params = null) {
    console.log('Video id is');
    console.log(params);
}

x.saveVideoToJson('QjxScn7cKo8').then(function(res) {
    let info = extractInfo(res);
    info.videoCount = i;
    i++;
    downloadQueue.push(new yt(info, cb));


}); */