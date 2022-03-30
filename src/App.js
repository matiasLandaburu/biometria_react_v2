import React, {useEffect, useRef, useState} from 'react'
import './App.css';
import * as facemesh  from "@tensorflow-models/facemesh"
import Webcam from 'react-webcam';
import { tf } from '@tensorflow/tfjs';
import {drawMesh} from "./utilities.js"
 
 
 
function App() {
  //setup references
  const webcamRef =  useRef(null);
  const canvasRef = useRef(null)
  //var ctx = null;
 
  //const [ctx, setCtx] = useState(null)
 
  useEffect(() => {
    setCamera()
    drawCanvas()
  },[])
 
  const drawCanvas = () => {
      var ctx = null;
      ctx = canvasRef.current.getContext("2d")
      //console.log(ctx)
      ctx.beginPath();
      ctx.strokeStyle = "blue";
      //ctx.rect(0, 0, 100, 100);
      const h = canvasRef.current.height
      const w = canvasRef.current.width
      ctx.rect(w/2 - (w/10), h/2 - (h/4), w/5, h/2)
      ctx.stroke();
  }
 
 
 
 
  // load facemesh
  const runFacemesh =  async() => {
 
    const net = await facemesh.load({
      inputResolution:{width:480, height:240}, scale:0.8
    })
    setInterval(() => {
      detect(net)
    }, 0)
 
  }
 
  // Detect function
  const setCamera =  async () => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight
 
      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
 
      // set canvas width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
    }
  }

  const detect =  async(net) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Get video properties
      const video = webcamRef.current.video
      //const videoWidth = webcamRef.current.video.videoWidth
      //const videoHeight = webcamRef.current.video.videoHeight
 
      // Set video width
      //webcamRef.current.video.width = videoWidth
      //webcamRef.current.video.height = videoHeight
 
      // set canvas width
      //canvasRef.current.width = videoWidth
      //canvasRef.current.height = videoHeight
 
      // Make detections
      const face = await net.estimateFaces(video);
      //console.log(face)
 
      // Get canvas context for drawing
      //drawCanvas()
    }
 
  }

  //drawCanvas()
  runFacemesh()
 
  return (
    <div className="App">
      <header className='App-header'>
        <div className='containter'>
          <div className='row'>
            <div className='col-12'>
            <Webcam ref={webcamRef} style={ 
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:480,
          height:240
 
        }
      }/>
      <canvas ref={canvasRef} style={
        {
          position:"absolute",
          marginLeft:"auto",
          marginRight:"auto",
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:480,
          height:240,
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
 
 
 
export default App;