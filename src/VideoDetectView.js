import React, {useEffect, useRef, useState} from 'react'
import './App.css';
import * as facemesh  from "@tensorflow-models/facemesh"
import Webcam from 'react-webcam';
import { tf } from '@tensorflow/tfjs';
import {drawMesh} from "./utilities.js"
import { isCompositeComponent } from 'react-dom/test-utils';
 
 
 
const VideoDetectView = ({setDetect}) => {
  //setup references
  const webcamRef =  useRef(null);
  const canvasRef = useRef(null)
 
  const mediaRecorderRef = useRef(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  var stream;

  //const [isRecording, setCurrentRecord] = useState(false)
  //const [capturing, setCapturing] = useState(false);

  const [recordObject, setRecordObject] = useState({
    capturing:false,
    recording:false
  })

  var interval
  //var ctx = null;
 
  //const [ctx, setCtx] = useState(null)
 
  useEffect(() => {
    setCamera()
    drawCanvas()
    runFacemesh()
  },[])
 
  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/mp4"
      });
      console.log(blob)
      const url = URL.createObjectURL(blob);
      console.log(url)
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.mp4";
      a.click();
      window.URL.revokeObjectURL(url);
 
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);
 
  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    console.log("Stop record")
    //setCapturing(false);
    setRecordObject({
      ...recordObject,
      capturing:false
    })
  }, [mediaRecorderRef, webcamRef, setRecordObject]);
 
   const handleStartCaptureClick = React.useCallback(() => {
    //setCapturing(true);
    //setCurrentRecord(true)
 
    console.log("Start record")
    if(stream == null){
      stream = webcamRef.current.stream
    }
     console.log(stream)
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );

    setDetect(true)

    setRecordObject({
      capturing:true,
      recording:true
    })

    mediaRecorderRef.current.start();
  }, [webcamRef, setRecordObject, mediaRecorderRef]);
 
  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
        console.log(data)
        handleDownload()
      }
    },
    [setRecordedChunks]
  );
 
  const drawCanvas = (color = "blue") => {
    console.log("drawCanvas")
      var ctx = null;
      ctx = canvasRef.current.getContext("2d")
      //console.log(ctx)
      ctx.beginPath();
      ctx.strokeStyle = color;
      //ctx.rect(0, 0, 100, 100);
      const h = canvasRef.current.height
      const w = canvasRef.current.width
      var x = w/2 - (w/10)
      var y = h/2
      ctx.rect(w/2 - (w/10), h/2 - (h/4), w/5, h/2)
      ctx.stroke();
      console.log("x: " + x + "y: " + y)
  }
 
 
 
 
  // load facemesh
  const runFacemesh =  async() => {
    console.log("runFaceMesh")
    const net = await facemesh.load({
      inputResolution:{width:480, height:240}, scale:0.8
    })
 
       interval = setInterval(() => {
        if(!recordObject.recording){
          detect(net)
        }else{
          clearInterval(interval);
        }       
      }, 10000)
 
 
 
 
  }
 
  const setCamera = async () => {
    console.log("SetCamera")
    // Get video properties
 
    const video = webcamRef.current.video
    var videoWidth = webcamRef.current.video.videoWidth
    var videoHeight = webcamRef.current.video.videoHeight
    videoWidth = videoWidth == 0 ? 480 : videoWidth
    videoHeight = videoHeight == 0 ? 240 : videoHeight
 
    // Set video width
 
    webcamRef.current.video.width = videoWidth
    webcamRef.current.video.height = videoHeight
 
    // set canvas width
 
    canvasRef.current.width = videoWidth
    canvasRef.current.height = videoHeight
    stream = webcamRef.current.stream
    //console.log(stream)
 
    }
 
  const detect =  async(net) => {
    console.log("detect")
 
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Get video properties
      const video = webcamRef.current.video
 
      // Make detections
      const predictions = await net.estimateFaces(video);
 
 
      // Get canvas context for drawing
      //drawCanvas()
 
       if (predictions.length > 0){
 
         for (let i = 0; i < predictions.length; i++) {
     //Code goes here
      var score = predictions[i].faceInViewConfidence;
      const keyPoints = predictions[i].scaledMesh;
      const x = keyPoints[i][0];
      const y = keyPoints[i][1];
      // console.log("x: " + x + "y: " + y)
      console.log("x: " +x + " y: " + y)
      if(x> 300 && x < 392 && y > 200 && y < 290  && !recordObject.recording){
        clearInterval(interval)
        drawCanvas('greenyellow')
        handleStartCaptureClick()
        setTimeout(() => {handleStopCaptureClick();}, 4000) 
      }
    // var deltaX = predictions[i].annotations.leftEyeLower0[0][0]  -predictions[i].annotations.rightEyeLower0[0][0] 
    // var deltaY = predictions[i].annotations.leftEyeLower0[0][1]  -predictions[i].annotations.rightEyeLower0[0][1] 
 
    //  console.log(predictions[i])
    //  console.log( deltaX - deltaY )
    //  console.log("score: " + score)
 }}
 
 
    }
 
  }
 
  return (
    <div className="App">
      <header className='App-header'>
 
        <div className='containter'>
          <div className='row'>
            <div className='col-12'>
              <Webcam id="webCam" ref={webcamRef} style={ 
                {
                  position:"absolute",
                  marginLeft:"auto",
                  marginRight:"auto",
                  left:0,
                  right:0,
                  textAlign:"center",
                  zIndex:9,
        
        
                }
              }/>
              <canvas id="canvas" ref={canvasRef} style={
                {
                  position:"absolute",
                  marginLeft:"auto",
                  marginRight:"auto",
                  left:0,
                  right:0,
                  textAlign:"center",
                  zIndex:9,
        
                  border:"1px solid red"
                }
              }/>

            </div>
          </div>
        </div>
                      
      </header>
 
    </div>
  );
}
 
 
 
export default VideoDetectView;