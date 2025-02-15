const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors()); 

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Создание папки для хранилища, если она не существует
const fs = require('fs');
const dir = './uploads';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

// Эндпоинт для загрузки изображения
app.post('/upload', upload.single('image'), (req, res) => {
  res.status(200).json({ 
    url: `http://localhost:${PORT}/uploads/${req.file.filename}` 
  });
});

// Эндпоинт для доступа к загруженным изображениям
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
