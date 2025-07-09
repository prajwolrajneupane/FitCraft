import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useLoader, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Box3, Vector3, CanvasTexture } from 'three';
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

import {
  Stage,
  Layer,
  Image as KonvaImage,
  Transformer,
  Text,
  Line,
} from 'react-konva';
import { useImage } from 'react-konva-utils';

const CANVAS_SIZE = 600;

// 3d luga harko lagi
function Dress({ canvasTextures }) {
  const { name } = useParams();
  const location = useLocation();
  const items = location.state;
  const gltf = useLoader(GLTFLoader, items.threeD); //uta bata aairaxa
  const ref = useRef();
  const { camera } = useThree();
// just to center the tshirt biccha ma
  useEffect(() => {
    if (ref.current) {
      const box = new Box3().setFromObject(ref.current);
      const center = new Vector3();
      const size = new Vector3();
      box.getCenter(center);
      box.getSize(size);
      ref.current.position.sub(center);
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

  useEffect(() => {
    if (ref.current) {
      ref.current.traverse((child) => {
        if (child.isMesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => {
              mat.map = null;
              mat.needsUpdate = true;
              if (canvasTextures[mat.name]) {
                mat.map = canvasTextures[mat.name];
                mat.needsUpdate = true;
              }
            });
          } else {
            const mat = child.material;
            mat.map = null;
            mat.needsUpdate = true;
            if (canvasTextures[mat.name]) {
              mat.map = canvasTextures[mat.name];
              mat.needsUpdate = true;
            }
          }
        }
      });
    }
  }, [canvasTextures]);

  return <primitive ref={ref} object={gltf.scene} scale={[0.1, 0.1, 0.1]} />;
}

// === React-Konva Handler for images with position and size control ===
function Handler({
  url,
  isSelected,
  onSelect,
  shapeRef,
  trRef,
  tool,
  imgProps,
  onChange,
}) {
  const [image] = useImage(url);

  useEffect(() => {
    if (isSelected && tool === 'cursor' && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, trRef, shapeRef, tool]);

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
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
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

// === Main integrated App component ===
function App() {
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
{
hasContent &&
          <button
          onClick={clearCanvas}
          className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700 font-semibold"
          title="Clear Canvas"
          >
            Clear Canvas
          </button>
          }

          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            ref={fileInputRef}
            className="cursor-pointer"
            title="Upload Image"
          />

          <button
            onClick={addNewText}
            disabled={tool !== 'cursor'}
            className={`px-3 py-1 rounded-md font-semibold text-white transition
              ${
                tool === 'cursor'
                  ? 'bg-purple-600 hover:bg-purple-700 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            title="Add Text"
          >
            Add Text
          </button>
        </div>
      </div>

      {/* Textarea for editing text */}
      {editingTextId && (
        <textarea
          style={{
            position: 'absolute',
            top: 100,
            left: 100,
            fontSize:
              data.texts.find((t) => t.id === editingTextId)?.fontSize || 30,
            color: data.texts.find((t) => t.id === editingTextId)?.fill || textColor,
            border: '1px solid #ccc',
            padding: 2,
            resize: 'none',
            zIndex: 20,
            background: 'transparent',
            outline: 'none',
            fontFamily: 'inherit',
            minWidth: 100,
          }}
          value={data.texts.find((t) => t.id === editingTextId)?.text || ''}
          onChange={(e) => changeText(editingTextId, e.target.value)}
          onBlur={() => setEditingTextId(null)}
          autoFocus
        />
      )}

      {/* Main content with padding so it doesn't get hidden under navbar */}
      <div className="pt-[72px] flex justify-center items-start gap-8 px-8 pb-8 bg-gray-50 min-h-screen">
        {/* Konva Canvas */}
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: 6,
            backgroundColor: 'white',
            width: CANVAS_SIZE,
            height: CANVAS_SIZE,
            cursor: getCursor(),
          }}
        >
          <Stage
            ref={stageRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
          >
            <Layer>
              {/* Draw lines */}
              {data.lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === 'eraser' ? 'white' : line.stroke}
                  strokeWidth={4}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation={
                    line.tool === 'eraser' ? 'destination-out' : 'source-over'
                  }
                  perfectDrawEnabled={false}
                />
              ))}

              {/* Draw images */}
              {data.imgUrl && (
                <Handler
                  url={data.imgUrl}
                  isSelected={isImageSelected}
                  onSelect={() => {
                    setSelectedTextId(null);
                    setIsImageSelected(true);
                  }}
                  shapeRef={imageRef}
                  trRef={imageTransformerRef}
                  tool={tool}
                  imgProps={data.imgProps}
                  onChange={(newProps) => {
                    setData({
                      ...data,
                      imgProps: newProps,
                    });
                  }}
                />
              )}

              {/* Draw texts */}
              {data.texts.map((text) => (
                <React.Fragment key={text.id}>
                  <Text
                    ref={(el) => (textRefs.current[text.id] = el)}
                    x={text.x}
                    y={text.y}
                    text={text.text}
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
                    onDblClick={() => startTextEditing(text.id)}
                    onDragEnd={(e) => onTextDragEnd(text.id, e)}
                    onTransformEnd={(e) => onTextTransformEnd(text.id, e)}
                    width={CANVAS_SIZE}
                    wrap="none"
                  />
                  {selectedTextId === text.id && tool === 'cursor' && (
                    <Transformer
                      ref={(el) => (transformerRefs.current[text.id] = el)}
                      boundBoxFunc={(oldBox, newBox) => {
                        // limit resize
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </Layer>
          </Stage>
        </div>

        {/* 3D Canvas */}
        <div
          style={{
            width: 600,
            height: 600,
            border: '1px solid #ccc',
            borderRadius: 6,
            backgroundColor: 'white',
          }}
        >
          <Canvas>
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 5, 5]} intensity={0.6} />
            <Dress canvasTextures={canvasTextures.current} />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <div className="w-full flex justify-center mt-6">
        <button
          onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate("/details");
            } else {
              navigate("/login");
            }
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition"
        >
          Buy Now
        </button>
      </div>
    </>
  );
}

export default App;
