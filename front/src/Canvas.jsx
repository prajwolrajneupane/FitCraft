//this code only gives us a canvas and not a tshirt to draw on rn, this needs to be fixed
import { useRef } from "react";
import React from "react";
import { useState } from "react";
import {Stage,Layer,Line,Rect} from "react-konva";
import 'remixicon/fonts/remixicon.css'
function Canvas(){
  const [undone, setundone] = useState([]);
    const [lines,setLines]=useState([]);
    const [Tool, setTool] = useState("Pencil");
    const [Color, setColor] = useState("black");
const [chosenSize, setchosenSize] = useState("5");
const isDrawing=useRef(false);
// yesko udyasya vanya:
// Starts as false
// Can be updated without re-rendering the component
//why didnt we used usestate, useref ko satta?:
//react state updates are asynchronous, so immediate updation hudaina
// useref ma immediate update hunxa tesaile we using it

const handleMouseDown=(e)=>{
    isDrawing.current=true;
     setundone([]);  //this is added so that, when the user does undo and draws, redo wwala button kaam nagaros
    
    const pos=e.target.getStage().getPointerPosition();
    // getstage vanya yo shape kun Stage ma xa vanera dinxa, getpointerposition vanya tesko co-ordinates haru li, so pos ma, x ra y(mouse position) ko co ordinates haru aauxa
    setLines([...lines,{points:[pos.x, pos.y],color:Color,Tool,chosenSize}])
    // points wala object ra previous lines lai set garira

}

const handleMouseMove=(e)=>{
    
    if(!isDrawing.current) return;
    const stage=e.target.getStage();
    const point = stage.getPointerPosition();
    const LastLine=lines[lines.length-1] // last recorded co ordinate herna
LastLine.points=LastLine.points.concat([point.x,point.y])

// console.log(LastLine.points);
const newLines=[...lines.slice(0,-1),LastLine] // slice chai kina vanda, hamlai chaine jati info is all in lastline, so we removing the info that is storing at the last of the lines array

setLines(newLines)
}


  const handleMouseUp = () => {
    isDrawing.current = false;

  };
  
return (
  <>
  <Stage 
        
width={600}
      height={500}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
      style={{ border: '2px solid black',
        width:"600px"

       }}>

        <Layer>
          {lines.map((line,i)=>(

            <Line
            
            key={i}
            points={line.points}
            stroke={ line.Tool === "Eraser" ?"white": line.color}
            // so stroke ko color ekcchoti change current color ni sabai change hunxa
              strokeWidth={ line.chosenSize}
            tension={0.5}
            lineCap="round"
          
              globalCompositeOperation={
                line.Tool === "Eraser" ? "destination-out" : "source-over"
              }
            ></Line>
          ))}
        </Layer>
  </Stage>
  <input type="color" value={Color}  onChange={(e) => setColor(e.target.value)} />
 <div onClick={()=>{setTool("Pencil")}}>
  <i className="ri-pencil-fill"></i>
 </div>
 

 <div onClick={()=>{
  
  setTool("Eraser")}}>
  <i className="ri-eraser-line"></i>
 </div>

   <input type="range"  value={chosenSize} onChange={(e)=>(setchosenSize(e.target.value))} />
 


<button onClick={()=>{
  if (lines.length===0) return
setundone([...undone,lines[lines.length - 1]])
  const undo=(lines.slice(0,-1))
   setLines(undo)
}}>
  undo
  </button> 

  
<button className="Redo" onClick={() => {
  if (undone.length === 0) return;

  const lastUndone = undone[undone.length - 1];
  setLines([...lines, lastUndone]);
  setundone(undone.slice(0, -1));
}}>
  Redo
</button>
</>

)

}

export default Canvas