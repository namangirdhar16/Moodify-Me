const video = document.querySelector("#video")

const body = document.querySelector("body");


// buttons
const $onOff = document.querySelector(".onbutton");
const $detectmyface = document.querySelector(".detectmyface");
const $capture = document.querySelector(".capture");
const $fileToUpload = document.querySelector(".fileToUpload");



var firstTime = true;
 
$onOff.addEventListener("click", () => {
   
  if(video.paused)
  {
    video.play();
    video.poster = "placeholder.jpg";
  }
  else{
    video.load();
    video.pause();
    
    video.poster = "placeholder.jpg";
  }
   
    
})

$capture.addEventListener("click", () => {
   
  var canva = document.createElement("canvas");
  canva.width = video.width;
  canva.height = video.height;

  var ctx = canva.getContext("2d");
  ctx.drawImage(video, 0, 0);

  var dataURL = canva.toDataURL("image/png");
  if(dataURL)
  {
    video.poster = dataURL;
    video.pause();
    dataURL = null;
  }
  console.log(dataURL);

})
var detectionOn = false;

$detectmyface.addEventListener("click", () => {
  detectionOn = !detectionOn;
})
const startVideo = function(){
    navigator.getUserMedia({ video: {}}, (stream) => video.srcObject = stream, err => console.log(err))
}


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
]).then(startVideo);

var canvas = null;

setInterval(() => {
  main();
}, 100);

const main = () => {
  video.addEventListener('play', () => {
          
    if(firstTime)
    {
      canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);
      firstTime = false;
    }
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    if(detectionOn)
    { 
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }
   
    // console.log(detections);
    }
  , 100)
})


}




