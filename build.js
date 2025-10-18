import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function build() {
    console.log('🚀 Starting build process...');
    
    const buildDir = join(__dirname, 'build');
    
    // Очищаем папку билда
    if (fs.existsSync(buildDir)) {
        console.log('📁 Cleaning build directory...');
        fs.rmSync(buildDir, { recursive: true });
    }
    
    // Создаем папку билда
    fs.mkdirSync(buildDir, { recursive: true });
    console.log('✅ Build directory created');
    
    // Функция для копирования
    const copy = (src, dest) => {
        if (fs.statSync(src).isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            const files = fs.readdirSync(src);
            files.forEach(file => {
                copy(join(src, file), join(dest, file));
            });
        } else {
            fs.copyFileSync(src, dest);
        }
    };
    
    // Копируем файлы
    copy('index.html', join(buildDir, 'index.html'));
    copy('css', join(buildDir, 'css'));
    copy('js', join(buildDir, 'js'));
    copy('images', join(buildDir, 'images'));
    
    console.log('🎉 Build completed!');
}

build();
