export function initSelection(app) {
    const selectionSection = document.querySelector('[data-component="selection"]');
    if (!selectionSection) return;

    selectionSection.innerHTML = `
    <div class="section-inner">
        <div class="selection-header">
            <h2>Настройте ваш пакет</h2>
            <p class="subtitle">Добавьте услуги к вашему пакету</p>
            
            <div class="selection-stats">
                <div class="stat-item">
                    <span class="stat-label">Персонажи:</span>
                    <span class="stat-value" id="characters-count">0</span>
                    <span class="stat-limit" id="characters-limit">/0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Шоу-программы:</span>
                    <span class="stat-value" id="shows-count">0</span>
                    <span class="stat-limit" id="shows-limit">/0</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Мастер-классы:</span>
                    <span class="stat-value" id="master-count">0</span>
                    <span class="stat-limit" id="master-limit">/0</span>
                </div>
                <div class="stat-item total">
                    <span class="stat-label">Итого:</span>
                    <span class="stat-value total-price" id="total-price">0</span>
                    <span class="currency">₽</span>
                </div>
            </div>
        </div>

        <div class="selection-categories">
            <!-- Персонажи -->
            <div class="category-section">
                <div class="category-header">
                    <h3>🎭 Выберите персонажей</h3>
                    <div class="category-counter">
                        <span id="current-character">1</span> / <span id="total-characters">${app.characters.length}</span>
                    </div>
                </div>
                <div class="carousel-container">
                    <button class="carousel-arrow carousel-arrow-prev" data-category="characters">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <div class="carousel-track" id="characters-carousel">
                        <div class="carousel-inner">
                            ${app.characters.map(character => `
                                <div class="carousel-item" data-character="${character.name}">
                                    <div class="selection-card">
                                        <div class="card-image">
                                            <img src="${character.image}" alt="${character.name}" loading="lazy">
                                            <div class="card-overlay">
                                                <button class="select-btn ${app.state.selectedCharacters.some(c => c.name === character.name) ? 'selected' : ''}" 
                                                        data-type="character" data-id="${character.name}">
                                                    ${app.state.selectedCharacters.some(c => c.name === character.name) ? '✓ Выбрано' : 'Выбрать'}
                                                </button>
                                            </div>
                                        </div>
                                        <div class="card-content">
                                            <h4 class="card-title">${character.name}</h4>
                                            <p class="card-description">${character.description}</p>
                                            ${app.state.currentPackage === 'custom' ?
        `<div class="card-price">${app.data.customPrices.character}₽</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="carousel-arrow carousel-arrow-next" data-category="characters">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="carousel-dots" id="characters-dots"></div>
            </div>

            <!-- Шоу-программы -->
            <div class="category-section">
                <div class="category-header">
                    <h3>🎪 Выберите шоу-программы</h3>
                    <div class="category-counter">
                        <span id="current-show">1</span> / <span id="total-shows">${app.shows.length}</span>
                    </div>
                </div>
                <div class="carousel-container">
                    <button class="carousel-arrow carousel-arrow-prev" data-category="shows">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <div class="carousel-track" id="shows-carousel">
                        <div class="carousel-inner">
                            ${app.shows.map(show => `
                                <div class="carousel-item" data-show="${show.name}">
                                    <div class="selection-card">
                                        <div class="card-image">
                                            <img src="${show.image}" alt="${show.name}" loading="lazy">
                                            <div class="card-overlay">
                                                <button class="select-btn ${app.state.selectedShows.some(s => s.name === show.name) ? 'selected' : ''}" 
                                                        data-type="show" data-id="${show.name}">
                                                    ${app.state.selectedShows.some(s => s.name === show.name) ? '✓ Выбрано' : 'Выбрать'}
                                                </button>
                                            </div>
                                        </div>
                                        <div class="card-content">
                                            <h4 class="card-title">${show.name}</h4>
                                            <p class="card-description">${show.description}</p>
                                            ${app.state.currentPackage === 'custom' ?
        `<div class="card-price">${app.data.customPrices.show}₽</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="carousel-arrow carousel-arrow-next" data-category="shows">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="carousel-dots" id="shows-dots"></div>
            </div>

            <!-- Мастер-классы -->
            <div class="category-section">
                <div class="category-header">
                    <h3>🎨 Выберите мастер-классы</h3>
                    <div class="category-counter">
                        <span id="current-master">1</span> / <span id="total-master">${app.masterClasses.length}</span>
                    </div>
                </div>
                <div class="carousel-container">
                    <button class="carousel-arrow carousel-arrow-prev" data-category="master">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    
                    <div class="carousel-track" id="master-carousel">
                        <div class="carousel-inner">
                            ${app.masterClasses.map(master => `
                                <div class="carousel-item" data-master="${master.name}">
                                    <div class="selection-card">
                                        <div class="card-image">
                                            <div class="card-icon">${master.icon || '🎨'}</div>
                                            <div class="card-overlay">
                                                <button class="select-btn ${app.state.selectedMasterClasses.some(m => m.name === master.name) ? 'selected' : ''}" 
                                                        data-type="master" data-id="${master.name}">
                                                    ${app.state.selectedMasterClasses.some(m => m.name === master.name) ? '✓ Выбрано' : 'Выбрать'}
                                                </button>
                                            </div>
                                        </div>
                                        <div class="card-content">
                                            <h4 class="card-title">${master.name}</h4>
                                            <p class="card-description">${master.description}</p>
                                            ${app.state.currentPackage === 'custom' ?
        `<div class="card-price">${app.data.customPrices.master}₽</div>` : ''}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="carousel-arrow carousel-arrow-next" data-category="master">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div class="carousel-dots" id="master-dots"></div>
            </div>
        </div>

        <div class="selected-preview">
            <div id="selected-services"></div>
        </div>
    </div>
    `;

    initCarousels(app);
    initSelectionHandlers(app);

    // Слушаем событие выбора пакета
    document.addEventListener('packageSelected', (event) => {
        const packageType = event.detail;
        updateSelectionUI(app, packageType);
    });
}

function initCarousels(app) {
    const categories = ['characters', 'shows', 'master'];

    categories.forEach(category => {
        const track = document.getElementById(`${category}-carousel`);
        const prevBtn = document.querySelector(`[data-category="${category}"].carousel-arrow-prev`);
        const nextBtn = document.querySelector(`[data-category="${category}"].carousel-arrow-next`);
        const dots = document.getElementById(`${category}-dots`);
        const items = track.querySelectorAll('.carousel-item');

        if (!track || !prevBtn || !nextBtn || !dots) return;

        let currentIndex = 0;
        const itemsPerView = getItemsPerView();

        // Создаем точки
        dots.innerHTML = Array.from({length: Math.ceil(items.length / itemsPerView)}, (_, i) =>
            `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
        ).join('');

        function updateCarousel() {
            const itemWidth = items[0].offsetWidth + 30; // width + gap
            const translateX = -currentIndex * itemWidth * itemsPerView;
            track.querySelector('.carousel-inner').style.transform = `translateX(${translateX}px)`;

            // Обновляем точки
            dots.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Обновляем счетчик
            const counterElement = document.getElementById(`current-${category}`);
            if (counterElement) {
                counterElement.textContent = currentIndex + 1;
            }

            // Обновляем состояние стрелок
            const maxIndex = Math.ceil(items.length / itemsPerView) - 1;
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        }

        function nextSlide() {
            const maxIndex = Math.ceil(items.length / itemsPerView) - 1;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Обработчики событий
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);

        // Обработчики для точек
        dots.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel-dot')) {
                currentIndex = parseInt(e.target.dataset.index);
                updateCarousel();
            }
        });

        // Touch события
        let startX = 0;
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        track.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });

        // Адаптивность
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarousel();
        });

        updateCarousel();
    });
}

function getItemsPerView() {
    if (window.innerWidth < 768) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
}

function initSelectionHandlers(app) {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('select-btn')) {
            const type = e.target.dataset.type;
            const id = e.target.dataset.id;
            handleItemSelect(app, type, id, e.target);
        }
    });
}

function handleItemSelect(app, type, id, button) {
    let selectedArray, maxLimit, errorMessage;

    switch (type) {
        case 'character':
            selectedArray = app.state.selectedCharacters;
            maxLimit = app.state.maxCharacters;
            errorMessage = `Максимум ${maxLimit} персонаж(а) для выбранного пакета`;
            break;
        case 'show':
            selectedArray = app.state.selectedShows;
            maxLimit = app.state.maxShows;
            errorMessage = `Максимум ${maxLimit} шоу-программ(ы) для выбранного пакета`;
            break;
        case 'master':
            selectedArray = app.state.selectedMasterClasses;
            maxLimit = app.state.maxMasterClasses;
            errorMessage = `Максимум ${maxLimit} мастер-класс(а) для выбранного пакета`;
            break;
        default:
            return;
    }

    const isSelected = selectedArray.some(item => item.name === id);

    if (isSelected) {
        // Удаляем элемент
        const index = selectedArray.findIndex(item => item.name === id);
        selectedArray.splice(index, 1);
        button.classList.remove('selected');
        button.textContent = 'Выбрать';
    } else {
        // Проверяем лимит
        if (selectedArray.length >= maxLimit) {
            showNotification(errorMessage, 'error');
            return;
        }
        // Добавляем элемент
        selectedArray.push({ name: id });
        button.classList.add('selected');
        button.textContent = '✓ Выбрано';
    }

    // Анимация кнопки
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);

    updateSelectionUI(app, app.state.currentPackage);
    document.dispatchEvent(new CustomEvent('selectionUpdated'));
}

function updateSelectionUI(app, packageType) {
    // Обновляем лимиты в интерфейсе
    const charactersLimit = document.getElementById('characters-limit');
    const showsLimit = document.getElementById('shows-limit');
    const masterLimit = document.getElementById('master-limit');

    if (charactersLimit) charactersLimit.textContent = `/ ${app.state.maxCharacters}`;
    if (showsLimit) showsLimit.textContent = `/ ${app.state.maxShows}`;
    if (masterLimit) masterLimit.textContent = `/ ${app.state.maxMasterClasses}`;
}