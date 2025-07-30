import { Environment } from "@react-three/drei";
import React, { useRef, useEffect, useState, useCallback } from 'react';

import axios from "axios";
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';

import { OrbitControls } from '@react-three/drei';
import {GLTFExporter} from  'three/examples/jsm/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3, CanvasTexture } from 'three';
import { useParams, useLocation, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import {
  Stage, Layer, Image as KonvaImage, Transformer, Text, Line,
} from 'react-konva';
import { useImage } from 'react-konva-utils';

const CANVAS_SIZE = 600;

// 3d luga harko lagi
function Dress({ canvasTextures, shirtColor,dressRef }) {
  const { name } = useParams();
  const location = useLocation();
  const items = location.state;
  const gltf = useLoader(GLTFLoader, items.threeD); //uta bata aairaxa
  const { camera } = useThree();

  // just to center the tshirt biccha ma
  useEffect(() => {
    if (dressRef.current) {
      const box = new Box3().setFromObject(dressRef.current);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);
      dressRef.current.position.sub(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.position.set(0, 0, maxDim * 2);
      camera.lookAt(0, 0, 0);
    }
  }, [gltf, camera]);

  useFrame(() => {
    ['Front', 'Back'].forEach((side) => {
      if (canvasTextures[side]) {
        canvasTextures[side].needsUpdate = true;
      }
    });
  });

  // this is projecting canvas ko drawing onto 3d
  useEffect(() => {
    if (dressRef.current) {
      dressRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          //mesh ra material ho vane

          // Set texture map and shirt base color
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.map = null;
              mat.needsUpdate = true;
              if (canvasTextures[mat.name]) {
                mat.map = canvasTextures[mat.name];
                mat.needsUpdate = true;
              }
              // Apply base color to material
              mat.color.set(shirtColor);
            });
          } else {
            const mat = child.material;
            mat.map = null;
            mat.needsUpdate = true;
            if (canvasTextures[mat.name]) {
              mat.map = canvasTextures[mat.name];
              mat.needsUpdate = true;
            }
            mat.color.set(shirtColor);
          }
        }
      });
    }
  }, [canvasTextures, shirtColor]);

  return <primitive ref={dressRef} object={gltf.scene} scale={[0.1, 0.1, 0.1]} />;
}

// image handler
function Handler({
  url,isSelected,onSelect,shapeRef,trRef,tool,imgProps,onChange,
}) {
  const [image] = useImage(url);

  useEffect(() => {
    if (isSelected && tool === 'cursor' && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]); //jaba select hunxa taba transformer pani image ma add on garinxa
      trRef.current.getLayer().batchDraw();//redraw transformer layer for update
    }
  }, [isSelected, trRef, shapeRef, tool,image]);

  if (!image) return null;

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        x={imgProps.x}
        y={imgProps.y}
        width={imgProps.width}
        height={imgProps.height}
        draggable={tool === 'cursor'}
        onClick={() => tool === 'cursor' && onSelect()}
        onTap={() => tool === 'cursor' && onSelect()}
        onDragEnd={(e) => {
          onChange({
            ...imgProps,
            // this means, imagprops ma vaako sabai chij preserve raakh onchange ma
            x: e.target.x(),
            y: e.target.y(),
            // and replace x and y with the new position of x and y
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // Reset scale after applying
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(20, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
          });
        }}
      />
      {isSelected && tool === 'cursor' && <Transformer ref={trRef} />}
    </>
  );
}

// main:
function App() {
  const dressRef = useRef();

  const navigate = useNavigate();

  const [activeSide, setActiveSide] = useState('Front');

  // Store data separately for Front and Back including image position and size
  const [frontData, setFrontData] = useState({
    lines: [],
    texts: [],
    imgUrl: null,
    imgProps: { x: 50, y: 50, width: 200, height: 200 }, // default size and pos
  });
  const [backData, setBackData] = useState({
    lines: [],
    texts: [],
    imgUrl: null,
    imgProps: { x: 50, y: 50, width: 200, height: 200 },
  });

  // Current editor states (point to activeSide data)
  const data = activeSide === 'Front' ? frontData : backData;
  const setData = activeSide === 'Front' ? setFrontData : setBackData;

  // T-shirt color state
  const [shirtColor, setShirtColor] = useState('#ffffff'); // default white

  // Konva and editor refs and states
  const stageRef = useRef();
  const imageRef = useRef();
  const imageTransformerRef = useRef();
  const textRefs = useRef({});
  const transformerRefs = useRef({});
  const fileInputRef = useRef();

  const [tool, setTool] = useState('cursor');
  const [pencilColor, setPencilColor] = useState('#000000');
  const [textColor, setTextColor] = useState('skyblue');
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTextId, setSelectedTextId] = useState(null);
  const [editingTextId, setEditingTextId] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [lastPos, setLastPos] = useState(null);


//----- okay so when the user clicks buy now, the model is downloaded first and sent to the backend to proceed-------//
const buyNow = async () => {
  // Ensure latest Konva drawing is synced
  syncStageToTexture();

  const dressObject = dressRef.current; 
  if (!dressObject) return;

  const exporter = new GLTFExporter();
  exporter.parse(
    dressObject,
    async (result) => {
      const output = JSON.stringify(result, null, 2);
      const blob = new Blob([output], { type: 'application/json' });

      const formData = new FormData();
      //  included filename 'lugaFata.glb' //yo chai naam dya ho so that backend ma ni yo naam ko prayog hos// backend ma heresi dekhinxa
      formData.append('model', blob, 'lugaFata.glb');
      // "model" lekhya multer ko lagi ho, blob ta luga nei send garya vaigo

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post('http://localhost:5000/api/save', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          // exactly what we did for the user page haina, sending the token from the localStorage to backend for user ko Jankari
          // content type teso chai hamle model singai pathauna parya vayera lekhya(solely for that);
        });
        console.log('Upload success:', res.data);
  
    navigate('/details');
      } catch (error) {
        console.error('Upload failed:', error.response?.data || error.message);
      }
    },
    { binary: false } // false means export as JSON (.gltf), true means binary (.glb)

  );
};


  // Offscreen canvases for Front and Back for three.js texture source
  const offscreenCanvases = useRef({
    Front: document.createElement('canvas'),
    Back: document.createElement('canvas'),
  });

  // Setup offscreen canvases dimensions
  useEffect(() => {
    Object.values(offscreenCanvases.current).forEach((c) => {
      c.width = CANVAS_SIZE;
      c.height = CANVAS_SIZE;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
    });
  }, []);

  // Three.js CanvasTextures created once
  const canvasTextures = useRef({
    Front: new CanvasTexture(offscreenCanvases.current.Front),
    Back: new CanvasTexture(offscreenCanvases.current.Back),
  });

  // Sync Konva Stage content to offscreen canvas for activeSide
  const syncStageToTexture = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const offscreenCanvas = offscreenCanvases.current[activeSide];
    const ctx = offscreenCanvas.getContext('2d');

    // Clear
    ctx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw white background to avoid transparency
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw Konva stage on offscreen canvas
    // Using toCanvas to get all drawings including images & texts
    const konvaCanvas = stage.toCanvas({ pixelRatio: 1 });
    ctx.drawImage(konvaCanvas, 0, 0);

    // Mark texture needs update
    canvasTextures.current[activeSide].needsUpdate = true;
  }, [activeSide]);

  // When activeSide data changes, sync to texture
  useEffect(() => {
    syncStageToTexture();
  }, [data, syncStageToTexture]);

  // Konva Drawing Handlers
  const handleMouseDown = (e) => {
    if (tool === 'pencil' || tool === 'eraser') {
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLastPos(pos);
      //yeta k va vanda:
      // setData ma either front ya back xa
      // so hamle konva image vitra, tools harko jankari lera 
      setData((prev) => ({
        ...prev,
    
        lines: [
          ...prev.lines,
          {
            tool,
            points: [pos.x, pos.y],
            stroke: tool === 'eraser' ? null : pencilColor,
          },
        ],
      }));
    } else {
      if (e.target === e.target.getStage()) {
        setSelectedTextId(null);
        setEditingTextId(null);
        setIsImageSelected(false);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;

    let lastLine = data.lines[data.lines.length - 1];
    if (!lastLine) return;

    // Append points
    const newLines = data.lines.slice(0, -1);
    lastLine.points = [...lastLine.points, point.x, point.y];
    setData({ ...data, lines: [...newLines, lastLine] });
    setLastPos(point);
  };

  const handleMouseUp = () => setIsDrawing(false);

  // File upload image handler
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setData({
      ...data,
      imgUrl: url,
      imgProps: { x: 50, y: 50, width: 200, height: 200 }, // reset to default position and size
    });
    setIsImageSelected(true);
  };
  const hasContent = data.lines.length > 0 || data.texts.length > 0 || data.imgUrl !== null;

  // Clear canvas (for active side)
  const clearCanvas = () => {
    setData({ lines: [], texts: [], imgUrl: null, imgProps: { x: 50, y: 50, width: 200, height: 200 } });
    setSelectedTextId(null);
    setEditingTextId(null);
    setIsImageSelected(false);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  // Keyboard events for deleting selected text or image, finishing text edit
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Delete') {
        if (isImageSelected) {
          setData({ ...data, imgUrl: null });
          setIsImageSelected(false);
          if (fileInputRef.current) fileInputRef.current.value = null;
        }
        if (selectedTextId) {
          setData({
            ...data,
            texts: data.texts.filter((t) => t.id !== selectedTextId),
          });
          setSelectedTextId(null);
          setEditingTextId(null);
        }
      }
      if (e.key === 'Enter' && editingTextId) {
        e.preventDefault();
        setEditingTextId(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [data, isImageSelected, selectedTextId, editingTextId]);

  // When text selected, attach transformer
  useEffect(() => {
    if (
      selectedTextId &&
      tool === 'cursor' &&
      transformerRefs.current[selectedTextId] &&
      textRefs.current[selectedTextId]
    ) {
      transformerRefs.current[selectedTextId].nodes([
        textRefs.current[selectedTextId],
      ]);
      transformerRefs.current[selectedTextId].getLayer().batchDraw();
    }
  }, [selectedTextId, tool, data.texts]);

  // Add new text to canvas
  const addNewText = () => {
    const newId = `text-${Date.now()}`;
    setData({
      ...data,
      texts: [
        ...data.texts,
        { id: newId, text: 'New Text', x: 60, y: 60, fontSize: 30, fill: textColor },
      ],
    });
    setSelectedTextId(newId);
    setEditingTextId(newId);
  };

  // Start editing text
  const startTextEditing = (id) => {
    if (tool !== 'cursor') return;
    setEditingTextId(id);
  };

  // Change text content
  const changeText = (id, val) => {
    setData({
      ...data,
      texts: data.texts.map((t) => (t.id === id ? { ...t, text: val } : t)),
    });
  };

  // Drag and transform handlers for text
  const onTextDragEnd = (id, e) => {
    const { x, y } = e.target.position();
    setData({
      ...data,
      texts: data.texts.map((t) => (t.id === id ? { ...t, x, y } : t)),
    });
  };
  const onTextTransformEnd = (id, e) => {
    const node = e.target;
    const scaleY = node.scaleY();
    node.scaleX(1);
    node.scaleY(1);
    setData({
      ...data,
      texts: data.texts.map((t) =>
        t.id === id
          ? {
              ...t,
              fontSize: Math.max(5, t.fontSize * scaleY),
              x: node.x(),
              y: node.y(),
            }
          : t
      ),
    });
  };

  // Cursor style for konva stage based on tool
  const getCursor = () => {
    if (tool === 'pencil') return 'crosshair';
    if (tool === 'eraser') return 'cell';
    return 'default';
  };

  return (
    <>
      {/* Sticky Navbar Controls */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md px-6 py-3 flex flex-wrap items-center justify-between font-sans select-none">
        {/* Left side: Side selector */}
        <div className="flex gap-3 items-center">
          <strong className="hidden sm:block mr-2 text-gray-700 font-semibold">Side:</strong>
          {['Front', 'Back'].map((side) => (
            <button
              key={side}
              onClick={() => setActiveSide(side)}
              className={`px-3 py-1 rounded-md border transition text-sm
                ${
                  activeSide === side
                    ? 'font-bold border-indigo-600 bg-indigo-100'
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
            >
              {side}
            </button>
          ))}
        </div>

        {/* Middle: Tool selector */}
        <div className="flex gap-3 items-center mt-2 sm:mt-0">
          <strong className="hidden sm:block mr-2 text-gray-700 font-semibold">Tool:</strong>
          {['cursor', 'pencil', 'eraser'].map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              title={t}
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition
                ${
                  tool === t
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
            >
              {t === 'cursor' ? 
                <i className="ri-cursor-fill"></i>
              : t === 'pencil' ? <i className="ri-edit-fill"></i> : <i className="ri-eraser-fill"></i>}
            </button>
          ))}
        </div>

        {/* Right side: Color pickers and clear */}
        <div className="flex gap-3 items-center mt-2 sm:mt-0">
          <label className="flex items-center gap-1 cursor-pointer" title="Pencil Color">
            <span className="hidden sm:inline font-semibold text-gray-700">Pencil:</span>
            <input
              type="color"
              value={pencilColor}
              onChange={(e) => setPencilColor(e.target.value)}
              disabled={tool === 'eraser'}
              className={`w-8 h-8 p-0 border rounded cursor-pointer ${
                tool === 'eraser' ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
          </label>

          <label className="flex items-center gap-1 cursor-pointer" title="Text Color">
            <span className="hidden sm:inline font-semibold text-gray-700">Text:</span>
            <input
              type="color"
              value={
                selectedTextId
                  ? data.texts.find((t) => t.id === selectedTextId)?.fill || textColor
                  : textColor
              }
              onChange={(e) => {
                const newColor = e.target.value;
                setTextColor(newColor);
                if (selectedTextId) {
                  setData({
                    ...data,
                    texts: data.texts.map((t) =>
                      t.id === selectedTextId ? { ...t, fill: newColor } : t
                    ),
                  });
                }
              }}
              disabled={tool !== 'cursor'}
              className={`w-8 h-8 p-0 border rounded cursor-pointer ${
                tool !== 'cursor' ? 'cursor-not-allowed opacity-50' : ''
              }`}
            />
          </label>

          {/* Shirt Color Picker */}
          <label className="flex items-center gap-1 cursor-pointer" title="T-Shirt Color">
            <span className="hidden sm:inline font-semibold text-gray-700">Shirt:</span>
            <input
              type="color"
              value={shirtColor}
              onChange={(e) => setShirtColor(e.target.value)}
              className="w-8 h-8 p-0 border rounded cursor-pointer"
            />
          </label>

          <button
            onClick={clearCanvas}
            disabled={!hasContent}
            title="Clear Canvas"
            className={`px-3 py-1 rounded-md text-sm border transition ${
              hasContent
                ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Clear
          </button>

          <button
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            title="Upload Image"
            className="px-3 py-1 rounded-md text-sm border border-gray-400 hover:bg-gray-100"
          >
            Upload Image
          </button>

          <button
            onClick={addNewText}
            title="Add Text"
            className="px-3 py-1 rounded-md text-sm border border-gray-400 hover:bg-gray-100"
          >
            Add Text
          </button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFile}
      />

      {/* Main content area */}
      <div
        className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 pt-20"
        style={{ minHeight: 'calc(100vh - 64px)' }}
      >
        {/* 2D canvas editor on left */}
        <div className="border rounded-lg shadow-lg bg-white">
          <Stage
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={stageRef}
            style={{ cursor: getCursor() }}
          >
            <Layer>
              {/* Draw all lines */}
              {data.lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === 'eraser' ? '#ffffff' : line.stroke || pencilColor}
                  strokeWidth={3}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                />
              ))}

              {/* Draw image if any */}
              {data.imgUrl && (
                <Handler
                  url={data.imgUrl}
                  isSelected={isImageSelected}
                  onSelect={() => {
                    if (tool === 'cursor') {
                      setIsImageSelected(true);
                      setSelectedTextId(null);
                      setEditingTextId(null);
                    }
                  }}
                  shapeRef={imageRef}
                  trRef={imageTransformerRef}
                  tool={tool}
                  imgProps={data.imgProps}
                  onChange={(newProps) => setData({ ...data, imgProps: newProps })}
                />
              )}

              {/* Draw texts */}
              {data.texts.map((text) => (
                <Text
                  key={text.id}
                  ref={(el) => (textRefs.current[text.id] = el)}
                  text={text.text}
                  x={text.x}
                  y={text.y}
                  fontSize={text.fontSize}
                  fill={text.fill}
                  draggable={tool === 'cursor'}
                  onClick={() => {
                    if (tool === 'cursor') {
                      setSelectedTextId(text.id);
                      setEditingTextId(null);
                      setIsImageSelected(false);
                    }
                  }}
                  onTap={() => {
                    if (tool === 'cursor') {
                      setSelectedTextId(text.id);
                      setEditingTextId(null);
                      setIsImageSelected(false);
                    }
                  }}
                  onDragEnd={(e) => onTextDragEnd(text.id, e)}
                  onTransformEnd={(e) => onTextTransformEnd(text.id, e)}
                  onDblClick={() => startTextEditing(text.id)}
                />
              ))}

              {/* Transformer for selected text */}
              {selectedTextId && (
                <Transformer
                  ref={(el) => {
                    if (el) transformerRefs.current[selectedTextId] = el;
                  }}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (newBox.width < 5 || newBox.height < 5) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              )}
            </Layer>
          </Stage>

          {/* Editable text input */}
          {editingTextId && (
            <textarea
              style={{
                position: 'absolute',
                top: textRefs.current[editingTextId]?.getAbsolutePosition()?.y + 60,
                left: textRefs.current[editingTextId]?.getAbsolutePosition()?.x + 20,
                fontSize: textRefs.current[editingTextId]?.fontSize() || 20,
                border: '1px solid #ccc',
                padding: '4px',
                background: 'white',
                outline: 'none',
                resize: 'none',
                fontFamily: 'Arial',
                zIndex: 1000,
                minWidth: 100,
                maxWidth: 400,
              }}
              value={data.texts.find((t) => t.id === editingTextId)?.text || ''}
              onChange={(e) => changeText(editingTextId, e.target.value)}
              onBlur={() => setEditingTextId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setEditingTextId(null);
                }
              }}
              autoFocus
            />
          )}
        </div>

        {/* 3D preview on right */}
        <div className="border rounded-lg shadow-lg bg-white" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
          <Canvas shadows>
             <Environment preset="sunset" />
            <ambientLight intensity={0.} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <Dress dressRef={dressRef} canvasTextures={canvasTextures.current} shirtColor={shirtColor} />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          </Canvas>
        </div>
        
      </div>

        <button
  onClick={buyNow}
  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
>
  Buy Now


</button>

    </>
  );
}

export default App;
