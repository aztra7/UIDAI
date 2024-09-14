const video=document.getElementById('video')

Promise.all([
    faceapi.nets.tnyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(startVideo)
function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream =>video.srcObject = stream,
        err => console.error(err)
    )
}

video.addEventListener('play',() => {
    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width:video.width,height: video.height }
    faceapi.matchDimensions(canvas,displaySize)
    setIntervel(async () => {
       const detections = await faceapi.detectAllFaces(video,
        new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks
        ().withFaceExpressions()
        console.log(detections)
        constresizedDetections = faceapi.resizeResults(detections,
        displaySize )
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas,resizedDetections)
        faceapi.draw.drawFaceLanmarks(canvas,resizedDetections)
        faceapi.draw.drawFaceE(canvas,resizedDetections)
    },100)
})

startVideo()