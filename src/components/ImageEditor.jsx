import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { motion } from 'framer-motion';
import { ArrowLeft, Type, Circle, Square, Triangle, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const ImageEditor = ({ image, onBack }) => {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [activeShape, setActiveShape] = useState(null);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    });

    fabric.Image.fromURL(image.urls.regular, (img) => {
      const scale = Math.min(
        CANVAS_WIDTH / img.width,
        CANVAS_HEIGHT / img.height
      );
      img.scale(scale);
      
      img.set({
        left: (CANVAS_WIDTH - img.width * scale) / 2,
        top: (CANVAS_HEIGHT - img.height * scale) / 2,
         crossOrigin: 'anonymous'
      });

      fabricRef.current.add(img);
      fabricRef.current.sendToBack(img);
    },{crossOrigin: 'anonymous'});

    return () => {
      fabricRef.current.dispose();
    };
  }, [image]);

  const addText = () => {
    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
    });
    fabricRef.current.add(text);
    fabricRef.current.setActiveObject(text);
  };

  const addShape = (type) => {
    let shape;
    
    switch (type) {
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: 'rgba(255, 0, 0, 0.5)',
          left: 100,
          top: 100,
        });
        break;
      case 'rectangle':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: 'rgba(0, 255, 0, 0.5)',
          left: 100,
          top: 100,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: 'rgba(0, 0, 255, 0.5)',
          left: 100,
          top: 100,
        });
        break;
    }

    if (shape) {
      fabricRef.current.add(shape);
      fabricRef.current.setActiveObject(shape);
    }
  };

  const deleteSelected = () => {
    const activeObject = fabricRef.current.getActiveObject();
    if (activeObject) {
      fabricRef.current.remove(activeObject);
      fabricRef.current.requestRenderAll();
    }
  };

  const downloadImage = () => {
    try {
      const dataUrl = fabricRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      console.log(dataUrl);
      
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Failed to download image');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </button>
        
        <div className="flex items-center gap-4">
          <button
            onClick={addText}
            className="p-2 hover:bg-gray-100 rounded-lg tooltip"
            title="Add Caption or Text"
          >
            <Type className="w-5 h-5" />
          </button>
          <button
            onClick={() => addShape('circle')}
            className="p-2 hover:bg-gray-100 rounded-lg tooltip"
            title="Add Circle"
          >
            <Circle className="w-5 h-5" />
          </button>
          <button
            onClick={() => addShape('rectangle')}
            className="p-2 hover:bg-gray-100 rounded-lg tooltip"
            title="Add Rectangle"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => addShape('triangle')}
            className="p-2 hover:bg-gray-100 rounded-lg tooltip"
            title="Add Triangle"
          >
            <Triangle className="w-5 h-5" />
          </button>
          <button
            onClick={deleteSelected}
            className="p-2 hover:bg-gray-100 rounded-lg tooltip text-red-500"
            title="Delete Selected"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={downloadImage}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-white p-4 rounded-lg shadow-sm flex justify-center">
        <canvas ref={canvasRef} className="border border-gray-200" />
      </div>
    </motion.div>
  );
};

export default ImageEditor;