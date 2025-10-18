import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting build process...');

const buildDir = join(__dirname, 'build');

// Очищаем папку билда
if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true });
}

// Создаем папку билда
fs.mkdirSync(buildDir, { recursive: true });

// Копируем файлы
function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        for (const file of files) {
            copyRecursive(join(src, file), join(dest, file));
        }
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Копируем все необходимое
copyRecursive('index.html', join(buildDir, 'index.html'));
copyRecursive('css', join(buildDir, 'css'));
copyRecursive('js', join(buildDir, 'js'));
copyRecursive('images', join(buildDir, 'images'));

console.log('✅ Build completed!');
