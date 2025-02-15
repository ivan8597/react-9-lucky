import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import "../style.css"; 

const MemeEditor = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [text, setText] = useState<string>('');
  const [fontSize, setFontSize] = useState<number>(20);
  const [fontColor, setFontColor] = useState<string>('#000000');
  const [drawingMode, setDrawingMode] = useState<boolean>(false);
  const [eraseMode, setEraseMode] = useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const canvasInstance = new fabric.Canvas(canvasRef.current, {
      selection: true, // Позволяет выделять объекты
    });
    setCanvas(canvasInstance);
    return () => {
      canvasInstance.dispose();
    };
  }, []);

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;

      if (fileType === 'image/png' || fileType === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (canvas) {
            fabric.Image.fromURL(e.target?.result as string, (img) => {
              const canvasWidth = canvas.width || 500; // Установите значение по умолчанию
              img.scaleToWidth(canvasWidth);
              canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
              setIsImageLoaded(true);
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Пожалуйста, выберите файл в формате PNG или JPEG.');
      }
    }
  };

  const closeImage = () => {
    if (canvas) {
      canvas.clear(); // Очищаем канвас
      setIsImageLoaded(false); // Сбрасываем состояние загрузки изображения
      setText(''); // Очищаем текст
    }
  };

  const saveImage = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL(); // Получаем изображение в формате data URL
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'meme.png'; // Имя файла для скачивания
      link.click(); // Имитируем клик по ссылке для скачивания
    }
  };

  const addText = () => {
    if (canvas) {
      const textObj = new fabric.Text(text, { 
        left: 100, 
        top: 100, 
        fontSize: fontSize, 
        fill: fontColor 
      });
      canvas.add(textObj);
      canvas.renderAll();


      setText("")
    }
  };

  // const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
  //   const pointer = canvas?.getPointer(event.nativeEvent);
  //   if (pointer) {
  //     addText(pointer.x, pointer.y); // Добавляем текст в координаты клика
  //   }
  // };

  const toggleDrawingMode = () => {
    if (canvas) {
      setDrawingMode(!drawingMode);
      canvas.isDrawingMode = !canvas.isDrawingMode; // Включаем или отключаем режим рисования
      canvas.freeDrawingBrush.color = fontColor; 
      canvas.freeDrawingBrush.width = 5; 
    }
  };

  const toggleEraseMode = () => {
    if (canvas) {
      setEraseMode(!eraseMode);
      if (eraseMode) {
        canvas.isDrawingMode = false; 
      } else {
        canvas.isDrawingMode = true; 
        canvas.freeDrawingBrush.color = '#FFFFFF'; // Устанавливаем цвет кисти на белый для стирания
        canvas.freeDrawingBrush.width = 10; 
      }
    }
  };

  const deleteSelected = () => {
    if (canvas) {
      const activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject); // Удаляем выделенный объект
        canvas.renderAll(); // Обновляем канвас
      } else {
        alert('Выберите объект для удаления.');
      }
    }
  };

  // Функции для добавления фигур
  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: 'transparent',
        stroke: fontColor,
        left: 100,
        top: 100,
      });
      canvas.add(circle);
      canvas.renderAll();
    }
  };

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        width: 100,
        height: 50,
        fill: 'transparent',
        stroke: fontColor,
        left: 100,
        top: 100,
      });
      canvas.add(rect);
      canvas.renderAll();
      
    
    }
  };

  return (
    <div>
      <input type="file" onChange={uploadImage} accept="image/png, image/jpeg" />
      <button onClick={closeImage} disabled={!isImageLoaded}>Закрыть изображение</button>
      <button onClick={saveImage} disabled={!isImageLoaded}>Сохранить изменения</button>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Добавьте текст" 
      />
      <input 
        type="number" 
        value={fontSize} 
        onChange={(e) => setFontSize(Number(e.target.value))} 
        placeholder="Размер шрифта" 
      />
      <input 
        type="color" 
        value={fontColor} 
        onChange={(e) => setFontColor(e.target.value)} 
      />
      <button onClick={addText}>Добавить текст</button>
      <button onClick={addCircle}>Добавить круг</button>
      <button onClick={addRectangle}>Добавить прямоугольник</button>
      <button onClick={toggleDrawingMode}>
        {drawingMode ? 'Выключить рисование' : 'Включить рисование'}
      </button>
      <button onClick={toggleEraseMode}>
        {eraseMode ? 'Выключить стирание' : 'Включить стирание'}
      </button>
      <button onClick={deleteSelected}>Удалить выделенный объект</button>
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={500} 
        // onClick={handleCanvasClick} // Обработчик клика по канвасу
      />
    </div>
  );
};

export default MemeEditor;