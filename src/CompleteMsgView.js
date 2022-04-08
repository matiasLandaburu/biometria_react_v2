import React from 'react'
import { AiFillCheckCircle } from "react-icons/ai";

const CompleteMsgView = ({className}) => {
  return (
    <div style={{
        display:"flex",
        flexDirection:"column",
        alignItems:"center"
    }}>
        <AiFillCheckCircle style={{
            width:100,
            height:100,
            color:"#33FFDF"
        }}/>
        <h2>Felicitaciones</h2>
    </div>
  )
}

export default CompleteMsgView