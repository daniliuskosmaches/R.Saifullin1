import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация
const PORT = process.env.PORT || 3000;

// Инициализация приложения
const app = express();

// Мидлвары
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(__dirname));

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

// API: Получение данных для фронтенда
app.get('/api/init-data', (req, res) => {
  try {
    res.json({
      characters: charactersData,
      shows: showsData,
      masterClasses: masterClassesData,
      additionalServices: additionalServices
    });
  } catch (error) {
    console.error('Error generating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API: Создание заявки (упрощенная версия)
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

    // Базовая валидация
    if (!name || !phone || !eventDate || !childBirthday || !packageType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Создание заявки
    const booking = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      eventDate,
      childBirthday,
      packageType,
      totalPrice: total,
      createdAt: new Date().toISOString()
    };

    console.log(`New booking created: ${booking.id} for ${booking.name}`);

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    server: 'build.js',
    timestamp: new Date().toISOString()
  });
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
[file content end]
