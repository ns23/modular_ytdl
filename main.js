let Utube = require('./utubedl');
let extractInfo = require('./extract_info');
let yt = require('./download_video');


let printData = function(res) {
    console.log(res);
};



let x = new Utube();

/* 
x.getVideoInfo() will return json object https://github.com/fent/node-ytdl-core/blob/master/example/info.json

You need to pass follwoing information to downloadVideo
videoUrl: url of the video
Video name : name of the video that will be file name
format: //means the format of video/MP4|AVI|3GP

*/

var format = 'mp4'

let config = {
    videoUrl: 'https://www.youtube.com/watch?v=krLkLormwI4',
    videoName: 'Omkar Swarupa (Suresh Wadkar)' + '.' + format, //name of the video,
    itag: '18',
}

x.downloadVideo(config, printData);