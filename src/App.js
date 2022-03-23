
import React, {useRef} from 'react'
import './App.css';
import * as facemesh  from "@tensorflow-models/facemesh"
import Webcam from 'react-webcam';
import { tf } from '@tensorflow/tfjs';
import {drawMesh} from "./utilities.js"


function App() {
  //setup references
  const webcamRef =  useRef(null);
  const canvasRef = useRef(null)


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
  const detect =  async(net) => {
    if(typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4){
      // Get video properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight
      
      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      console.log("webCamRef Width:" + webcamRef.current.video.width)
      console.log("webCamRef Height:" + webcamRef.current.video.height)

      // set canvas width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      console.log("canvas Width:" + canvasRef.current.width)
      console.log("canvas Height:" + canvasRef.current.height )

      // Make detections
      const face = await net.estimateFaces(video);
      console.log(face)

      // Get canvas context for drawing

      const ctx = canvasRef.current.getContext("2d")
      
      drawMesh(face, ctx)
    }
  }

  runFacemesh()
  return (
    <div className="App">
      <header className='App-header'>
        <div className='containter'>
          <div className='row'>
            <div className='col-12'>
            <Webcam id='webCam' ref={webcamRef} style={ 
        {
          zIndex:9,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign:"center"
          
        }
      }/>
      <canvas id="canvas" ref={canvasRef} style={
        {
          zIndex:9,
          marginLeft: "auto",
          marginRight: "auto",
          textAlign:"center"
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
