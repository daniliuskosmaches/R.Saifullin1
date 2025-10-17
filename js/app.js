// Импорт модулей
import {
    charactersData,
    showsData,
    masterClassesData,
    reviewPhotosData,
    packagesData
} from './modules/data.js';

import {
    appState,
    updateSelection,
    resetSelection,
    calculateTotalPrice
} from './modules/state.js';

import {
    showNotification,
    formatPhone,
    initIntersectionObserver,
    initSmoothScroll
} from './modules/ui.js';

import {
    submitBooking,
    submitCharacterRequest
} from './modules/api.js';

// Импорт компонентов
import { initHeader } from './components/header.js';
import { initHero } from './components/hero.js';
import { initAbout } from './components/about.js';
import { initPackages } from './components/packages.js';
import { initSelection } from './components/selection.js';
import { initReviews } from './components/reviews.js';
import { initProducts } from './components/products.js';
import { initContact } from './components/contact.js';
import { initModals } from './components/modals.js';

// Импорт функций для работы с пакетами
import {
    removePackage,
    removeSelectedItem,
    getPackageName
} from './components/packages.js';

// Главная функция инициализации
class App {
    constructor() {
        this.state = appState;
        this.data = {
            characters: charactersData,
            shows: showsData,
            masterClasses: masterClassesData,
            reviews: reviewPhotosData,
            packages: packagesData,
            customPrices: {
                character: 2500,
                show: 3000,
                master: 2000,
                products: {
                    photo: 1500,
                    decor: 2000,
                    pinata: 1000
                }
            }
        };
        this.init();
    }

    init() {
        // Инициализация общих утилит
        initSmoothScroll();
        initIntersectionObserver();

        // Инициализация компонентов
        initHeader();
        initHero();
        initAbout();
        initPackages(this);
        initSelection(this);
        initReviews(this);
        initProducts(this);
        initContact(this);
        initModals(this);

        // Глобальные обработчики
        this.initGlobalHandlers();

        console.log('App initialized successfully');
    }

    initGlobalHandlers() {
        // Глобальные обработчики событий
        document.addEventListener('selectionUpdated', () => {
            this.updateUI();
        });
    }

    updateUI() {
        // Обновление счетчиков
        const charactersCount = document.getElementById('characters-count');
        const showsCount = document.getElementById('shows-count');
        const masterCount = document.getElementById('master-count');
        const totalPrice = document.getElementById('total-price');

        if (charactersCount) {
            charactersCount.textContent = this.state.selectedCharacters.length;
        }
        if (showsCount) {
            showsCount.textContent = this.state.selectedShows.length;
        }
        if (masterCount) {
            masterCount.textContent = this.state.selectedMasterClasses.length;
        }
        if (totalPrice) {
            totalPrice.textContent = calculateTotalPrice(this.state).toLocaleString('ru-RU');
        }

        // Обновление preview
        this.updateSelectedServicesPreview();
    }

    updateSelectedServicesPreview() {
        const preview = document.getElementById('selected-services');
        if (!preview) return;

        let html = '<h4>Выбранные услуги:</h4><div class="selected-items-preview">';

        // Пакет
        if (this.state.currentPackage) {
            html += `
            <div class="selected-item-card">
                <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 2rem;">📦</span>
                </div>
                <div class="selected-item-name">${getPackageName(this.state.currentPackage)}</div>
                <div class="remove-item-btn" onclick="app.removePackage()">×</div>
            </div>
        `;
        }

        // Персонажи
        this.state.selectedCharacters.forEach(char => {
            const character = this.data.characters.find(c => c.name === char.name);
            if (character) {
                html += `
                <div class="selected-item-card">
                    <img src="${character.image}" alt="${char.name}" class="selected-item-img">
                    <div class="selected-item-name">${char.name}</div>
                    ${this.state.currentPackage === 'custom' ? `<div class="price-tag">${this.data.customPrices.character}₽</div>` : ''}
                    <div class="remove-item-btn" onclick="app.removeSelectedItem('character', '${char.name}')">×</div>
                </div>
            `;
            }
        });

        // Шоу-программы
        this.state.selectedShows.forEach(show => {
            const showData = this.data.shows.find(s => s.name === show.name);
            if (showData) {
                html += `
                <div class="selected-item-card">
                    <img src="${showData.image}" alt="${show.name}" class="selected-item-img">
                    <div class="selected-item-name">${show.name}</div>
                    ${this.state.currentPackage === 'custom' ? `<div class="price-tag">${this.data.customPrices.show}₽</div>` : ''}
                    <div class="remove-item-btn" onclick="app.removeSelectedItem('show', '${show.name}')">×</div>
                </div>
            `;
            }
        });

        // Мастер-классы
        this.state.selectedMasterClasses.forEach(master => {
            const masterData = this.data.masterClasses.find(m => m.name === master.name);
            if (masterData) {
                html += `
                <div class="selected-item-card">
                    <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                        ${masterData.icon || '🎨'}
                    </div>
                    <div class="selected-item-name">${master.name}</div>
                    ${this.state.currentPackage === 'custom' ? `<div class="price-tag">${this.data.customPrices.master}₽</div>` : ''}
                    <div class="remove-item-btn" onclick="app.removeSelectedItem('master', '${master.name}')">×</div>
                </div>
            `;
            }
        });

        // Товары
        this.state.selectedProducts.forEach(prod => {
            let price = prod.price;
            let icon = '🎁';

            // Определяем иконку для товара
            if (prod.id === 'photo') icon = '📸';
            else if (prod.id === 'decor') icon = '🎈';
            else if (prod.id === 'pinata') icon = '🪅';

            // Кастомная цена для кастомного пакета
            if (this.state.currentPackage === 'custom') {
                if (prod.id === 'photo') price = this.data.customPrices.products.photo;
                else if (prod.id === 'decor') price = this.data.customPrices.products.decor;
                else if (prod.id === 'pinata') price = this.data.customPrices.products.pinata;
            }

            html += `
            <div class="selected-item-card">
                <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 2rem;">${icon}</span>
                </div>
                <div class="selected-item-name">${prod.name}</div>
                ${this.state.currentPackage === 'custom' ? `<div class="price-tag">${price}₽</div>` : ''}
                <div class="remove-item-btn" onclick="app.removeSelectedItem('product', '${prod.id}')">×</div>
            </div>
        `;
        });

        // Дополнительные услуги
        this.state.selectedAdditionalServices.forEach(serv => {
            let price = serv.price;
            let icon = '🍰';

            // Определяем иконку для услуги
            if (serv.id === 'photographer') icon = '📷';
            else if (serv.id === 'pinata') icon = '🪅';
            else if (serv.id === 'cake') icon = '🎂';

            // Кастомная цена для кастомного пакета
            if (this.state.currentPackage === 'custom') {
                if (serv.id === 'photographer') price = this.data.customPrices.products.photo;
                else if (serv.id === 'pinata') price = this.data.customPrices.products.pinata;
                else if (serv.id === 'cake') price = 0;
            }

            html += `
            <div class="selected-item-card">
                <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 2rem;">${icon}</span>
                </div>
                <div class="selected-item-name">${serv.name}</div>
                ${this.state.currentPackage === 'custom' && price > 0 ? `<div class="price-tag">${price}₽</div>` : ''}
                <div class="remove-item-btn" onclick="app.removeSelectedItem('additional', '${serv.id}')">×</div>
            </div>
        `;
        });

        html += '</div>';
        preview.innerHTML = html;
    }

    // Методы-обертки для вызова из HTML
    removePackage() {
        removePackage(this);
        this.updateSelectedServicesPreview();
    }

    removeSelectedItem(type, identifier) {
        removeSelectedItem(this, type, identifier);
        this.updateSelectedServicesPreview();
    }

    // Геттеры для доступа к данным
    get characters() { return charactersData; }
    get shows() { return showsData; }
    get masterClasses() { return masterClassesData; }
    get reviews() { return reviewPhotosData; }
    get packages() { return packagesData; }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Экспорт для использования в компонентах
export {
    charactersData,
    showsData,
    masterClassesData,
    reviewPhotosData,
    packagesData,
    showNotification,
    formatPhone,
    submitBooking,
    submitCharacterRequest,
    updateSelection,
    resetSelection,
    calculateTotalPrice
};