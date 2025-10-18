import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация
dotenv.config();
const PORT = process.env.PORT || 3000;
const PRICE_SECRET = process.env.PRICE_SECRET || crypto.randomBytes(32).toString('hex');

// Инициализация приложения
const app = express();

// Мидлвары
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        "https://r-saifullin-8.onrender.com"
      ],
      fontSrc: [
        "'self'",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],
      mediaSrc: [
        "'self'",
        "https:",
        "blob:"
      ],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Лимитер запросов для API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
});
app.use('/api/', apiLimiter);

// Правильная настройка статических файлов
app.use(express.static(__dirname, {
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
      '.html': 'text/html; charset=UTF-8',
      '.css': 'text/css; charset=UTF-8',
      '.js': 'application/javascript; charset=UTF-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.svg': 'image/svg+xml',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    };

    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
      if (ext !== '.js') {
        res.setHeader('X-Content-Type-Options', 'nosniff');
      }
    } else {
      res.status(404).end();
      return;
    }
  }
}));

// Блокировка доступа к серверным файлам
app.get([
  '/app.js',
  '/build.js',
  '/server.js', 
  '/package.json', 
  '/package-lock.json', 
  '/node_modules/*',
  '/.env',
  '/.git/*',
  '/data.json',
  '/.gitignore',
  '/README.md'
], (req, res) => {
  console.log('Blocked access to server file:', req.path);
  res.status(404).send('Not found');
});

// Функции для работы с ценами
function createPriceSignature(productId, price, type = 'character') {
  const data = `${type}:${productId}:${price}:${Date.now()}`;
  const signature = crypto.createHmac('sha256', PRICE_SECRET)
    .update(data)
    .digest('hex');
  
  return { price, signature, timestamp: Date.now() };
}

function verifyPriceSignature(productId, price, signature, timestamp, type = 'character') {
  const data = `${type}:${productId}:${price}:${timestamp}`;
  const expectedSignature = crypto.createHmac('sha256', PRICE_SECRET)
    .update(data)
    .digest('hex');
  
  return expectedSignature === signature && 
         (Date.now() - timestamp) < 300000;
}

function getRealPrice(productId, type = 'character') {
  let data;
  switch (type) {
    case 'character':
      data = charactersData.find(c => c.id === productId);
      break;
    case 'show':
      data = showsData.find(s => s.id === productId);
      break;
    case 'master':
      data = masterClassesData.find(m => m.id === productId);
      break;
    case 'additional':
      data = additionalServices.find(a => a.id === productId);
      break;
    default:
      return 0;
  }
  return data ? data.price : 0;
}

// Данные для фронтенда
const charactersData = [
  { id: 1, name: "Человек-Паук", desc: "Любимый супергерой детей", image: "/images/человек паук новый.PNG", price: 5000, video: "/videos/spiderman.mp4" },
  { id: 2, name: "Железный Человек", desc: "Гений, миллиардер, плейбой, филантроп", image: "/images/железный человек.PNG", price: 6000, video: "/videos/ironman.mp4" },
  { id: 3, name: "Бэтгерл", desc: "Отважная героиня Готэма", image: "/images/batgerl.PNG", price: 5500, video: "/videos/batgirl.mp4" },
  { id: 4, name: "Пьеро", desc: "Грустный персонаж итальянской комедии", image: "/images/IMG_1662.PNG", price: 4500, video: "/videos/piero.mp4" },
  { id: 5, name: "Эльза", desc: "Снежная королева из Холодного сердца", image: "/images/эльза.PNG", price: 6500, video: "/videos/elsa.mp4" },
  { id: 6, name: "Пират", desc: "Отважный морской разбойник", image: "/images/пират.PNG", price: 5000, video: "/videos/pirate.mp4" },
  { id: 7, name: "Гарри Поттер", desc: "Юный волшебник из Хогвартса", image: "/images/гарри поттер.PNG", price: 6000, video: "/videos/harrypotter.mp4" },
  { id: 8, name: "Черепашки ниндзя", desc: "Четверка героев-мутантов", image: "/images/черепашки ниндзя.PNG", price: 8000, video: "/videos/tmnt.mp4" },
  { id: 9, name: "Русалочка", desc: "Морская принцесса", image: "/images/русалочка.PNG", price: 5500, video: "/videos/mermaid.mp4" },
  { id: 10, name: "Лего Ниндзяго", desc: "Ниндзя из мира Леgo", image: "/images/лего ниндзяго.PNG", price: 5500, video: "/videos/ninjago.mp4" },
  { id: 11, name: "Белоснежка", desc: "Самая добрая принцесса", image: "/images/белоснежка.PNG", price: 5500, video: "/videos/snowwhite.mp4" },
  { id: 12, name: "Лунтик", desc: "Добрый пришелец с Луны", image: "/images/лунтик.PNG", price: 5000, video: "/videos/luntik.mp4" }
];

const showsData = [
  { id: 1, name: "Химическое Шоу", desc: "Удивительные эксперименты с жидким азотом", image: "/images/chemistry.jpeg", price: 10000, video: "/videos/chemistry-show.mp4" },
  { id: 2, name: "Бумажное Шоу", desc: "Музыка, танцы и море бумаги", image: "/images/paper.jpeg", price: 12000, video: "/videos/paper-show.mp4" },
  { id: 3, name: "Шоу Пузырей", desc: "Волшебный мир огромных мыльных пузырей", image: "/images/bubble.jpeg", price: 8000, video: "/videos/bubble-show.mp4" },
  { id: 4, name: "Шоу магии", desc: "Волшебное шоу для детей", image: "/images/majic.jpeg", price: 8000, video: "/videos/magic-show.mp4" }
];

const masterClassesData = [
  { id: 1, name: "Создание костюмов", desc: "Научитесь создавать костюмы своими руками", price: 2500, icon: "✂️" },
  { id: 2, name: "Актерское мастерство", desc: "Основы перевоплощения в персонажей", price: 3000, icon: "🎭" },
  { id: 3, name: "Грим и макияж", desc: "Профессиональные техники грима", price: 2800, icon: "🎨" }
];

const additionalServices = [
  { id: 1, name: "Тортик", price: 3000 },
  { id: 2, name: "Фотограф", price: 5000 },
  { id: 3, name: "Пиньята", price: 1500 }
];

// API: Получение данных для фронтенда с подписанными ценами
app.get('/api/init-data', (req, res) => {
  try {
    const signedCharacters = charactersData.map(char => ({
      ...char,
      signedPrice: createPriceSignature(char.id, char.price, 'character')
    }));

    const signedShows = showsData.map(show => ({
      ...show,
      signedPrice: createPriceSignature(show.id, show.price, 'show')
    }));

    const signedMasterClasses = masterClassesData.map(master => ({
      ...master,
      signedPrice: createPriceSignature(master.id, master.price, 'master')
    }));

    const signedAdditionalServices = additionalServices.map(service => ({
      ...service,
      signedPrice: createPriceSignature(service.id, service.price, 'additional')
    }));

    res.json({
      characters: signedCharacters,
      shows: signedShows,
      masterClasses: signedMasterClasses,
      additionalServices: signedAdditionalServices
    });
  } catch (error) {
    console.error('Error generating signed data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Создание заявки (упрощенная версия без email)
app.post('/api/bookings', async (req, res) => {
  try {
    const { 
      name, 
      phone, 
      email, 
      eventDate, 
      childBirthday, 
      packageType, 
      characters = [], 
      shows = [], 
      masterClasses = [], 
      additionalServices = [],
      total 
    } = req.body;

    // Валидация обязательных полей
    if (!name || !phone || !eventDate || !childBirthday || !packageType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Валидация email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Валидация телефона
    if (!/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(phone)) {
      return res.status(400).json({ error: 'Invalid phone format' });
    }

    // Валидация дат
    const eventDateObj = new Date(eventDate);
    const childBirthdayObj = new Date(childBirthday);
    const now = new Date();
    
    if (eventDateObj <= now) {
      return res.status(400).json({ error: 'Event date must be in the future' });
    }

    if (childBirthdayObj >= now) {
      return res.status(400).json({ error: 'Child birthday must be in the past' });
    }

    // Проверка цен
    for (const char of characters) {
      if (!verifyPriceSignature(char.id, char.price, char.signature, char.timestamp, 'character')) {
        return res.status(400).json({ error: 'Invalid character price detected' });
      }
    }

    for (const show of shows) {
      if (!verifyPriceSignature(show.id, show.price, show.signature, show.timestamp, 'show')) {
        return res.status(400).json({ error: 'Invalid show price detected' });
      }
    }

    for (const master of masterClasses) {
      if (!verifyPriceSignature(master.id, master.price, master.signature, master.timestamp, 'master')) {
        return res.status(400).json({ error: 'Invalid master class price detected' });
      }
    }

    for (const service of additionalServices) {
      if (!verifyPriceSignature(service.id, service.price, service.signature, service.timestamp, 'additional')) {
        return res.status(400).json({ error: 'Invalid additional service price detected' });
      }
    }

    // Пересчет общей суммы на сервере
    let calculatedTotal = 0;
    
    const packagePrices = {
      basic: 10000,
      standard: 35000,
      premium: 55000,
      custom: 0
    };
    
    calculatedTotal += packagePrices[packageType] || 0;

    characters.forEach(char => calculatedTotal += parseFloat(char.price));
    shows.forEach(show => calculatedTotal += parseFloat(show.price));
    masterClasses.forEach(master => calculatedTotal += parseFloat(master.price));
    additionalServices.forEach(service => calculatedTotal += parseFloat(service.price));

    // Проверка общей суммы
    if (Math.abs(parseFloat(total) - calculatedTotal) > 0.01) {
      return res.status(400).json({ 
        error: 'Total price mismatch', 
        calculatedTotal,
        receivedTotal: total 
      });
    }

    // Создание заявки (без сохранения в файл)
    const booking = {
      id: crypto.randomUUID(),
      name,
      phone,
      email,
      eventDate: eventDateObj,
      childBirthday: childBirthdayObj,
      packageType,
      characters,
      shows,
      masterClasses,
      additionalServices,
      totalPrice: calculatedTotal,
      createdAt: new Date(),
      ip: req.ip
    };

    console.log(`New booking created: ${booking.id} for ${booking.name}`);

    // Только логирование, без отправки email
    res.status(201).json({ 
      success: true, 
      booking: {
        id: booking.id,
        totalPrice: booking.totalPrice,
        createdAt: booking.createdAt
      },
      message: 'Заявка принята! Мы свяжемся с вами в ближайшее время.'
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Получение списка заявок (упрощенная версия)
app.get('/api/bookings', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.json({ 
    success: true,
    message: 'Admin access granted - booking storage disabled in build version',
    bookings: []
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'build.js',
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Обслуживание фронтенда - ДОЛЖНО БЫТЬ ПОСЛЕДНИМ
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Build server running on port ${PORT}`);
  console.log(`Open in browser: http://localhost:${PORT}`);
  console.log('Server type: BUILD (simplified version)');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Build server shutting down...');
  process.exit();
});
[fi\\le content end]\\\\\\\\\\\\\\\\\
