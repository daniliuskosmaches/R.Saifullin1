
export function initPackages(app) {
    const packagesSection = document.querySelector('[data-component="packages"]');
    if (!packagesSection) return;

    packagesSection.innerHTML = `
    <div class="section-inner">
      <h2>Пакеты услуг</h2>
      <p class="subtitle">Выберите подходящий вариант для вашего праздника</p>
      <div class="packages-container" id="packages-container"></div>
      <div id="package-selection" class="hidden">
        <!-- Selection будет добавлено здесь -->
      </div>
    </div>
  `;

    renderPackages(app);
    initPackageHandlers(app);
}

function renderPackages(app) {
    const container = document.getElementById('packages-container');
    if (!container) return;

    container.innerHTML = app.packages.map(pkg => `
    <div class="package-card ${pkg.id}" data-package="${pkg.id}">
      <h3 class="package-title">${pkg.name}</h3>
      <div class="package-price">${pkg.price.toLocaleString('ru-RU')} ₽</div>
      <ul class="package-features">
        ${pkg.features.map(feature => `<li>${feature}</li>`).join('')}
      </ul>
      <button class="package-button select-package" data-package="${pkg.id}">
        ${pkg.id === 'custom' ? 'Собрать свой пакет' : 'Выбрать пакет'}
      </button>
    </div>
  `).join('');
}

function initPackageHandlers(app) {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-package')) {
            const packageType = e.target.dataset.package;
            handlePackageSelect(app, packageType);
        }
    });
}

function handlePackageSelect(app, packageType) {
    console.log('Package selected:', packageType);

    // Обновляем состояние приложения
    app.state.currentPackage = packageType;
    updateSelectionLimits(app, packageType);

    // Показываем секцию выбора
    showPackageSelection();

    // Инициализируем выбор услуг
    initSelectionComponent(app);

    // Обновляем UI
    app.updateUI();

    // Отправляем событие для других компонентов
    document.dispatchEvent(new CustomEvent('packageSelected', {
        detail: packageType
    }));
}

function updateSelectionLimits(app, packageType) {
    const limits = {
        basic: { characters: 1, shows: 0, master: 1 },
        standard: { characters: 2, shows: 1, master: 0 },
        premium: { characters: 3, shows: 2, master: 1 },
        custom: { characters: 99, shows: 99, master: 99 }
    };

    const limit = limits[packageType] || limits.custom;
    app.state.maxCharacters = limit.characters;
    app.state.maxShows = limit.shows;
    app.state.maxMasterClasses = limit.master;
}

function showPackageSelection() {
    const packageSelection = document.getElementById('package-selection');
    if (packageSelection) {
        packageSelection.classList.remove('hidden');
        packageSelection.classList.add('active');
        console.log('Showing package selection');

        setTimeout(() => {
            packageSelection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    } else {
        console.error('Package selection element not found!');
    }
}

// Функция для инициализации компонента выбора
function initSelectionComponent(app) {
    const packageSelection = document.getElementById('package-selection');
    if (!packageSelection) return;

    // Рендерим компонент выбора в стиле основного скрипта
    packageSelection.innerHTML = `
        <div class="section-inner">
            <div class="selected-package-info">
                <h3>Выбран пакет: <span id="selected-package-name">${getPackageName(app.state.currentPackage)}</span></h3>
                <p>Вы можете выбрать до <span id="max-characters">${app.state.maxCharacters}</span> персонажей, 
                   до <span id="max-shows">${app.state.maxShows}</span> шоу-программ и 
                   до <span id="max-master">${app.state.maxMasterClasses}</span> мастер-классов</p>
                <div class="total-price">Итого: <span id="total-price">0</span>₽</div>
            </div>

            <!-- Персонажи -->
            <div class="selection-section">
                <h3 class="selection-section-title">
                    🎭 Персонажи 
                    <span class="selected-count" id="characters-count">0</span>/<span id="max-characters-display">${app.state.maxCharacters}</span>
                </h3>
                <div class="selection-navigation">
                    <button class="carousel-nav" id="characters-prev">‹</button>
                    <div class="character-carousel-container">
                        <div class="character-carousel" id="characters-slider"></div>
                    </div>
                    <button class="carousel-nav" id="characters-next">›</button>
                </div>
            </div>

            <!-- Шоу-программы -->
            <div class="selection-section">
                <h3 class="selection-section-title">
                    🎪 Шоу-программы 
                    <span class="selected-count" id="shows-count">0</span>/<span id="max-shows-display">${app.state.maxShows}</span>
                </h3>
                <div class="selection-navigation">
                    <button class="carousel-nav" id="shows-prev">‹</button>
                    <div class="show-carousel-container">
                        <div class="show-carousel" id="shows-slider"></div>
                    </div>
                    <button class="carousel-nav" id="shows-next">›</button>
                </div>
            </div>

            <!-- Мастер-классы -->
            <div class="selection-section">
                <h3 class="selection-section-title">
                    🎨 Мастер-классы 
                    <span class="selected-count" id="master-count">0</span>/<span id="max-master-display">${app.state.maxMasterClasses}</span>
                </h3>
                <div class="selection-navigation">
                    <button class="carousel-nav" id="master-prev">‹</button>
                    <div class="master-carousel-container">
                        <div class="master-carousel" id="master-slider"></div>
                    </div>
                    <button class="carousel-nav" id="master-next">›</button>
                </div>
            </div>

            <!-- Предпросмотр выбранных услуг -->
            <div class="selected-services-preview">
                <div id="selected-services"></div>
            </div>

            <!-- Кнопка заказа -->
            <div class="order-actions">
                <button class="cta-button" id="order-btn">Заказать выбранные услуги</button>
            </div>
        </div>
    `;

    // Инициализируем слайдеры
    initPackageSliders(app);
    initSelectionHandlers(app);
}

function initPackageSliders(app) {
    // Персонажи
    const charactersSlider = document.getElementById('characters-slider');
    if (charactersSlider) {
        charactersSlider.innerHTML = app.characters.map(character => {
            const isSelected = app.state.selectedCharacters.some(c => c.name === character.name);
            return `
                <div class="character-card ${isSelected ? 'selected' : ''}" data-name="${character.name}">
                    <img src="${character.image}" alt="${character.name}">
                    <div class="character-info">
                        <h4>${character.name}</h4>
                        <p>${character.description}</p>
                        ${app.state.currentPackage === 'custom' ? `<p class="price-tag">${app.data.customPrices.character}₽</p>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Шоу-программы
    const showsSlider = document.getElementById('shows-slider');
    if (showsSlider) {
        showsSlider.innerHTML = app.shows.map(show => {
            const isSelected = app.state.selectedShows.some(s => s.name === show.name);
            return `
                <div class="show-card ${isSelected ? 'selected' : ''}" data-name="${show.name}">
                    <img src="${show.image}" alt="${show.name}">
                    <div class="show-info">
                        <h4>${show.name}</h4>
                        <p>${show.description}</p>
                        ${app.state.currentPackage === 'custom' ? `<p class="price-tag">${app.data.customPrices.show}₽</p>` : ''}
                        <button class="view-btn" data-video="${show.video}" data-name="${show.name}">Посмотреть</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Мастер-классы
    const masterSlider = document.getElementById('master-slider');
    if (masterSlider) {
        masterSlider.innerHTML = app.masterClasses.map(master => {
            const isSelected = app.state.selectedMasterClasses.some(m => m.name === master.name);
            return `
                <div class="master-card ${isSelected ? 'selected' : ''}" data-name="${master.name}">
                    <div class="master-icon">${master.icon || '🎨'}</div>
                    <h4>${master.name}</h4>
                    <p>${master.description}</p>
                    ${app.state.currentPackage === 'custom' ? `<p class="price-tag">${app.data.customPrices.master}₽</p>` : ''}
                </div>
            `;
        }).join('');
    }

    // Инициализация навигации карусели
    initCarouselNavigation();
}

function initCarouselNavigation() {
    // Навигация для персонажей
    document.getElementById('characters-prev')?.addEventListener('click', () => scrollCarousel('characters-slider', -220));
    document.getElementById('characters-next')?.addEventListener('click', () => scrollCarousel('characters-slider', 220));

    // Навигация для шоу
    document.getElementById('shows-prev')?.addEventListener('click', () => scrollCarousel('shows-slider', -220));
    document.getElementById('shows-next')?.addEventListener('click', () => scrollCarousel('shows-slider', 220));

    // Навигация для мастер-классов
    document.getElementById('master-prev')?.addEventListener('click', () => scrollCarousel('master-slider', -220));
    document.getElementById('master-next')?.addEventListener('click', () => scrollCarousel('master-slider', 220));
}

function scrollCarousel(id, amount) {
    const carousel = document.getElementById(id);
    if (carousel) {
        carousel.scrollBy({ left: amount, behavior: 'smooth' });
    }
}

function initSelectionHandlers(app) {
    // Обработчики для карточек
    document.addEventListener('click', (e) => {
        // Персонажи
        if (e.target.closest('.character-card')) {
            const card = e.target.closest('.character-card');
            if (e.target.closest('.view-btn')) return;

            const name = card.dataset.name;
            handleItemSelection(app, 'character', name, card);
        }

        // Шоу-программы
        if (e.target.closest('.show-card')) {
            const card = e.target.closest('.show-card');
            if (e.target.closest('.view-btn')) return;

            const name = card.dataset.name;
            handleItemSelection(app, 'show', name, card);
        }

        // Мастер-классы
        if (e.target.closest('.master-card')) {
            const card = e.target.closest('.master-card');
            const name = card.dataset.name;
            handleItemSelection(app, 'master', name, card);
        }

        // Кнопки просмотра видео
        if (e.target.classList.contains('view-btn')) {
            const videoUrl = e.target.dataset.video;
            const title = e.target.dataset.name;
            if (videoUrl) {
                showVideoModal(videoUrl, title);
            }
        }

        // Кнопка заказа
        if (e.target.id === 'order-btn') {
            handleOrder(app);
        }
    });
}

function handleItemSelection(app, type, name, card) {
    let selectedArray, maxLimit;

    switch(type) {
        case 'character':
            selectedArray = app.state.selectedCharacters;
            maxLimit = app.state.maxCharacters;
            break;
        case 'show':
            selectedArray = app.state.selectedShows;
            maxLimit = app.state.maxShows;
            break;
        case 'master':
            selectedArray = app.state.selectedMasterClasses;
            maxLimit = app.state.maxMasterClasses;
            break;
        default:
            return;
    }

    const index = selectedArray.findIndex(item => item.name === name);

    if (index === -1) {
        if (selectedArray.length < maxLimit || app.state.currentPackage === 'custom') {
            const data = getItemData(app, type, name);
            selectedArray.push({ name, price: data?.price || 0 });
            card.classList.add('selected');
            showNotification(`${getTypeLabel(type)} "${name}" добавлен`, 'success');
        } else {
            showNotification(`Можно выбрать не более ${maxLimit} ${getTypeLabel(type, true)}`, 'error');
        }
    } else {
        selectedArray.splice(index, 1);
        card.classList.remove('selected');
    }

    updateSelectionUI(app);
}

function getItemData(app, type, name) {
    switch(type) {
        case 'character':
            return app.characters.find(c => c.name === name);
        case 'show':
            return app.shows.find(s => s.name === name);
        case 'master':
            return app.masterClasses.find(m => m.name === name);
        default:
            return null;
    }
}

function getTypeLabel(type, plural = false) {
    const labels = {
        character: plural ? 'персонажей' : 'персонаж',
        show: plural ? 'шоу-программ' : 'шоу',
        master: plural ? 'мастер-классов' : 'мастер-класс'
    };
    return labels[type] || 'элемент';
}

function updateSelectionUI(app) {
    // Обновляем счетчики
    document.getElementById('characters-count').textContent = app.state.selectedCharacters.length;
    document.getElementById('shows-count').textContent = app.state.selectedShows.length;
    document.getElementById('master-count').textContent = app.state.selectedMasterClasses.length;

    // Обновляем предпросмотр
    updateSelectedServicesPreview(app);

    // Обновляем общую стоимость
    updateTotalPrice(app);
}

function updateSelectedServicesPreview(app) {
    const preview = document.getElementById('selected-services');
    if (!preview) return;

    let html = '<h4>Выбранные услуги:</h4><div class="selected-items-preview">';

    // Пакет
    html += `
        <div class="selected-item-card">
            <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 2rem;">📦</span>
            </div>
            <div class="selected-item-name">${getPackageName(app.state.currentPackage)}</div>
            <div class="remove-item-btn" onclick="removePackage()">×</div>
        </div>
    `;

    // Персонажи
    app.state.selectedCharacters.forEach(char => {
        const character = app.characters.find(c => c.name === char.name);
        html += `
            <div class="selected-item-card">
                <img src="${character.image}" alt="${char.name}" class="selected-item-img">
                <div class="selected-item-name">${char.name}</div>
                ${app.state.currentPackage === 'custom' ? `<div class="price-tag">${app.data.customPrices.character}₽</div>` : ''}
                <div class="remove-item-btn" onclick="removeSelectedItem('character', '${char.name}')">×</div>
            </div>
        `;
    });

    // Шоу-программы
    app.state.selectedShows.forEach(show => {
        const showData = app.shows.find(s => s.name === show.name);
        html += `
            <div class="selected-item-card">
                <img src="${showData.image}" alt="${show.name}" class="selected-item-img">
                <div class="selected-item-name">${show.name}</div>
                ${app.state.currentPackage === 'custom' ? `<div class="price-tag">${app.data.customPrices.show}₽</div>` : ''}
                <div class="remove-item-btn" onclick="removeSelectedItem('show', '${show.name}')">×</div>
            </div>
        `;
    });

    // Мастер-классы
    app.state.selectedMasterClasses.forEach(master => {
        const masterData = app.masterClasses.find(m => m.name === master.name);
        html += `
            <div class="selected-item-card">
                <div class="selected-item-img" style="background: rgba(214, 196, 155, 0.2); display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                    ${masterData.icon}
                </div>
                <div class="selected-item-name">${master.name}</div>
                ${app.state.currentPackage === 'custom' ? `<div class="price-tag">${app.data.customPrices.master}₽</div>` : ''}
                <div class="remove-item-btn" onclick="removeSelectedItem('master', '${master.name}')">×</div>
            </div>
        `;
    });

    html += '</div>';
    preview.innerHTML = html;

    // Добавляем глобальные функции для удаления
    window.removePackage = function() {
        removePackage(app);
    };

    window.removeSelectedItem = function(type, name) {
        removeSelectedItem(app, type, name);
    };
}

function updateTotalPrice(app) {
    const totalPriceElement = document.getElementById('total-price');
    if (!totalPriceElement) return;

    let total = 0;

    if (app.state.currentPackage === 'custom') {
        total += app.state.selectedCharacters.length * app.data.customPrices.character;
        total += app.state.selectedShows.length * app.data.customPrices.show;
        total += app.state.selectedMasterClasses.length * app.data.customPrices.master;
    } else {
        // Для фиксированных пакетов используем базовую цену
        const packagePrices = {
            basic: 10000,
            standard: 35000,
            premium: 55000
        };
        total = packagePrices[app.state.currentPackage] || 0;
    }

    totalPriceElement.textContent = total.toLocaleString('ru-RU');
}

function showVideoModal(videoUrl, title) {
    // Реализация модального окна для видео
    console.log('Show video:', videoUrl, title);
    // Здесь должна быть реализация показа модального окна
}

function showNotification(message, type) {
    // Реализация уведомлений
    console.log(`${type}: ${message}`);
    // Здесь должна быть реализация показа уведомлений
}

function handleOrder(app) {
    // Обработка заказа
    console.log('Order placed:', app.state);
    // Здесь должна быть реализация обработки заказа
}

export function removePackage(app) {
    app.state.currentPackage = null;
    app.state.selectedCharacters = [];
    app.state.selectedShows = [];
    app.state.selectedMasterClasses = [];
    app.state.selectedProducts = [];
    app.state.selectedAdditionalServices = [];

    // Скрываем секцию выбора
    const packageSelection = document.getElementById('package-selection');
    if (packageSelection) {
        packageSelection.classList.remove('active');
        packageSelection.classList.add('hidden');
        packageSelection.innerHTML = '';
    }

    // Обновляем UI
    document.dispatchEvent(new CustomEvent('selectionUpdated'));
}

export function removeSelectedItem(app, type, identifier) {
    if (type === 'character') {
        const index = app.state.selectedCharacters.findIndex(c => c.name === identifier);
        if (index !== -1) app.state.selectedCharacters.splice(index, 1);
    } else if (type === 'show') {
        const index = app.state.selectedShows.findIndex(s => s.name === identifier);
        if (index !== -1) app.state.selectedShows.splice(index, 1);
    } else if (type === 'master') {
        const index = app.state.selectedMasterClasses.findIndex(m => m.name === identifier);
        if (index !== -1) app.state.selectedMasterClasses.splice(index, 1);
    }

    // Обновляем UI
    updateSelectionUI(app);

    // Обновляем состояние карточек
    const card = document.querySelector(`[data-name="${identifier}"]`);
    if (card) {
        card.classList.remove('selected');
    }
}

export function getPackageName(packageType) {
    const packageNames = {
        basic: 'Базовый',
        standard: 'Стандарт',
        premium: 'Премиум',
        custom: 'Кастомный'
    };
    return packageNames[packageType] || 'Пакет услуг';
}
