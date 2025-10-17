import { showNotification } from '../modules/ui.js';

export function initProducts(app) {
    const productsSection = document.querySelector('[data-component="products"]');
    if (!productsSection) return;

    productsSection.innerHTML = `
    <div class="section-inner">
      <h2>Дополнительные товары</h2>
      <p class="subtitle">Что еще может украсить ваш праздник</p>
      <div class="products-grid" id="products-grid"></div>
      <div class="product-checkbox-container" id="additional-services"></div>
    </div>
  `;

    renderProducts(app);
    renderAdditionalServices(app);
    initProductHandlers(app);
    initAdditionalServicesHandlers(app);
}

function renderProducts(app) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const products = [
        {
            id: 'pinata',
            name: 'Пиньята',
            price: 1500,
            image: 'images/pinyata.jpg',
            description: 'Яркие пиньяты с конфетами и подарками'
        },
        {
            id: 'decor',
            name: 'Оформление шарами',
            price: 3000,
            image: 'images/shary.jpg',
            description: 'Тематическое оформление праздника'
        },
        {
            id: 'photo',
            name: 'Фотосессия',
            price: 5000,
            image: 'images/photograph.jpg',
            description: 'Профессиональная съемка праздника'
        }
    ];

    productsGrid.innerHTML = products.map(product => {
        const isSelected = app.state.selectedProducts.some(p => p.id === product.id);
        const price = app.state.currentPackage === 'custom' ?
            (product.id === 'photo' ? 3000 :
                product.id === 'decor' ? 2000 :
                    product.id === 'pinata' ? 3500 : product.price) : product.price;

        return `
      <div class="product-card" data-product="${product.id}" data-name="${product.name}" data-price="${price}">
        <div class="product-image-container">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          <div class="product-overlay">
            <button class="add-product-btn ${isSelected ? 'selected' : ''}">
              ${isSelected ? 'Добавлено' : 'Добавить'}
            </button>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-price">от ${price.toLocaleString('ru-RU')} ₽</div>
        </div>
      </div>
    `;
    }).join('');
}

function renderAdditionalServices(app) {
    const additionalServices = document.getElementById('additional-services');
    if (!additionalServices) return;

    const services = [
        {
            type: 'cake',
            name: 'Тортик',
            price: 3000
        },
        {
            type: 'photographer',
            name: 'Фотограф',
            price: 5000
        },
        {
            type: 'pinata',
            name: 'Пиньята',
            price: 1500
        }
    ];

    additionalServices.innerHTML = services.map(service => {
        const isChecked = app.state.selectedAdditionalServices.some(s => s.id === service.type);
        const price = app.state.currentPackage === 'custom' ?
            (service.type === 'photographer' ? 3000 :
                service.type === 'pinata' ? 3500 :
                    service.type === 'cake' ? 0 : service.price) : service.price;

        return `
      <label class="product-checkbox">
        <input type="checkbox" class="additional-service" data-type="${service.type}" 
               data-name="${service.name}" data-price="${price}" ${isChecked ? 'checked' : ''}>
        <span class="checkmark"></span>
        ${service.name} ${price > 0 ? `(+${price}₽)` : ''}
      </label>
    `;
    }).join('');
}

function initProductHandlers(app) {
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-product-btn');
        if (addBtn) {
            const productCard = addBtn.closest('.product-card');
            const id = productCard.dataset.product;
            const name = productCard.dataset.name;
            let price = parseInt(productCard.dataset.price, 10);

            // Кастомная цена только для кастомного пакета
            if (app.state.currentPackage === 'custom') {
                if (id === 'photo') price = 3000;
                else if (id === 'decor') price = 2000;
                else if (id === 'pinata') price = 3500;
            }

            const existingIndex = app.state.selectedProducts.findIndex(p => p.id === id);

            if (existingIndex === -1) {
                app.state.selectedProducts.push({ id, name, price });
                addBtn.textContent = 'Добавлено';
                addBtn.classList.add('selected');
                showNotification(`Товар "${name}" добавлен`, 'success');
            } else {
                app.state.selectedProducts.splice(existingIndex, 1);
                addBtn.textContent = 'Добавить';
                addBtn.classList.remove('selected');
            }

            document.dispatchEvent(new CustomEvent('selectionUpdated'));
        }
    });
}

function initAdditionalServicesHandlers(app) {
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('additional-service')) {
            const checkbox = e.target;
            const type = checkbox.dataset.type;
            const name = checkbox.dataset.name;
            let price = parseInt(checkbox.dataset.price, 10);

            // Кастомная цена только для кастомного пакета
            if (app.state.currentPackage === 'custom') {
                if (type === 'photographer') price = 3000;
                else if (type === 'pinata') price = 3500;
                else if (type === 'cake') price = 0;
            }

            if (checkbox.checked) {
                if (!app.state.selectedAdditionalServices.some(s => s.id === type)) {
                    app.state.selectedAdditionalServices.push({ id: type, name, price });
                }
            } else {
                app.state.selectedAdditionalServices = app.state.selectedAdditionalServices.filter(s => s.id !== type);
            }

            document.dispatchEvent(new CustomEvent('selectionUpdated'));
        }
    });
}