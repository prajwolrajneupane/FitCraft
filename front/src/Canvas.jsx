import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Line, Image as KonvaImage } from "react-konva";
import "remixicon/fonts/remixicon.css";
import { useParams, useLocation } from "react-router-dom";

//this code only gives us a canvas and not a tshirt to draw on rn, this needs to be fixed
function Canvas() {
  const { name } = useParams();
  const location = useLocation();
  const items = location.state;

  const [undone, setUndone] = useState([]);
  const [lines, setLines] = useState([]);
  const [tool, setTool] = useState("Pencil");
  const [color, setColor] = useState("black");
  const [chosenSize, setChosenSize] = useState(5);
  const isDrawing = useRef(false);

  // yesko udyasya vanya:
  // Starts as false
  // Can be updated without re-rendering the component
  //why didnt we used usestate, useref ko satta?:
  //react state updates are asynchronous, so immediate updation hudaina
  // useref ma immediate update hunxa tesaile we using it

  const [bgImage, setBgImage] = useState(null);
  const offscreencanvas = useRef(null);
  // off screen canvas lai hold garxa vanera lekhya this one
  const offscreenCtxRef = useRef(null);

  const imgWidth = 600;
  const imgHeight = 500;

  useEffect(() => {
    const img = new window.Image();
    img.src = items.image;
    img.onload = () => {
      setBgImage(img);

      const offCanvas = document.createElement("canvas");
      offCanvas.width = imgWidth;
      offCanvas.height = imgHeight;
      const offCtx = offCanvas.getContext("2d");
      offCtx.clearRect(0, 0, imgWidth, imgHeight);
      offCtx.drawImage(img, 0, 0, imgWidth, imgHeight);

      offscreencanvas.current = offCanvas;
      offscreenCtxRef.current = offCtx;
    };
  }, [items.image]);

  const isPixelOpaque = (pos) => {
    if (!offscreenCtxRef.current) return false;
    const x = Math.floor(pos.x);
    const y = Math.floor(pos.y);
    if (x < 0 || x >= imgWidth || y < 0 || y >= imgHeight) return false;

    const pixel = offscreenCtxRef.current.getImageData(x, y, 1, 1).data;
    return pixel[3] > 10; // alpha threshold
  };

  const handleMouseDown = (e) => {
    const pos = e.target.getStage().getPointerPosition();
    // getstage vanya yo shape kun Stage ma xa vanera dinxa, getpointerposition vanya tesko co-ordinates haru li, so pos ma, x ra y(mouse position) ko co ordinates haru aauxa
    if (!isPixelOpaque(pos)) return;

    isDrawing.current = true;
    setUndone([]); //this is added so that, when the user does undo and draws, redo wwala button kaam nagaros
    setLines([...lines, { points: [pos.x, pos.y], color, tool, chosenSize }]);
    // points wala object ra previous lines lai set garira
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();

    if (!isPixelOpaque(point)) {
      handleMouseUp();
      return;
    }

    const lastLine = lines[lines.length - 1]; // last recorded co ordinate herna
    lastLine.points = lastLine.points.concat([point.x, point.y]);

    // console.log(LastLine.points);
    const newLines = [...lines.slice(0, -1), lastLine]; 
    // slice chai kina vanda, hamlai chaine jati info is all in lastline, so we removing the info that is storing at the last of the lines array

    setLines(newLines);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <Stage
        width={imgWidth}
        height={imgHeight}
        onMouseDown={handleMouseDown}
        onMousemove={handleMouseMove}
        onMouseup={handleMouseUp}
        className="border-2 border-black rounded-md shadow-md"
      >
        {/* Background image layer (non-interactive) */}
        <Layer listening={false}>
          {bgImage && (
            <KonvaImage image={bgImage} width={imgWidth} height={imgHeight} />
          )}
        </Layer>

        {/* Drawing and erasing layer */}
        <Layer>
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.tool === "Eraser" ? "black" : line.color}
              // so stroke ko color ekcchoti change current color ni sabai change hunxa
              strokeWidth={line.chosenSize}
              tension={0.5}
              lineCap="round"
              globalCompositeOperation={
                line.tool === "Eraser" ? "destination-out" : "source-over"
              }
            />
          ))}
        </Layer>
      </Stage>

      {/* Tools */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium">Color:</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 border border-gray-300 rounded-md"
          />
        </label>

        <button
          onClick={() => setTool("Pencil")}
          className={`p-2 rounded-full text-xl hover:bg-gray-200 transition ${
            tool === "Pencil" ? "bg-gray-300" : ""
          }`}
        >
          <i className="ri-pencil-fill"></i>
        </button>

        <button
          onClick={() => setTool("Eraser")}
          className={`p-2 rounded-full text-xl hover:bg-gray-200 transition ${
            tool === "Eraser" ? "bg-gray-300" : ""
          }`}
        >
          <i className="ri-eraser-line"></i>
        </button>
      </div>

      {/* Size Options */}
      <div className="flex gap-6 items-center">
        {[1, 2, 4].map((size) => (
          <div
            key={size}
            onClick={() => setChosenSize(size)}
            className={`cursor-pointer transition transform hover:scale-110 border ${
              chosenSize === size ? "ring-2 ring-blue-500" : "border-gray-400"
            } rounded-full`}
            style={{
              height: 10 + size * 3 + "px",
              width: 10 + size * 3 + "px",
              background: "black",
            }}
          ></div>
        ))}
      </div>

      {/* Undo / Redo Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            if (lines.length === 0) return;
            setUndone([...undone, lines[lines.length - 1]]);
            const undo = lines.slice(0, -1);
            setLines(undo);
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Undo
        </button>

        <button
          onClick={() => {
            if (undone.length === 0) return;
            const lastUndone = undone[undone.length - 1];
            setLines([...lines, lastUndone]);
            setUndone(undone.slice(0, -1));
          }}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export default Canvas;
