import { showNotification, formatPhone } from '../modules/ui.js';
import { submitBooking } from '../modules/api.js';

export function initContact(app) {
    const contactSection = document.querySelector('[data-component="contact"]');
    if (!contactSection) return;

    contactSection.innerHTML = `
    <div class="section-inner">
      <div class="consultation-form">
        <h3 class="form-title">Оставить заявку</h3>
        <form id="consultationForm" action="#" method="POST">
          <div class="selected-services" id="form-selected-services"></div>
          <div class="form-group">
            <label for="name" class="form-label">Ваше имя</label>
            <input type="text" id="name" name="name" class="form-input" placeholder="Иван Иванов" required>
          </div>
          <div class="form-group">
            <label for="phone" class="form-label">Телефон</label>
            <input type="tel" id="phone" name="phone" class="form-input" placeholder="+7 (XXX) XXX-XX-XX" required>
          </div>
          <div class="form-group">
            <label for="eventDate" class="form-label">Дата мероприятия</label>
            <input type="date" id="eventDate" name="eventDate" class="form-input" required>
          </div>
          <div class="form-group">
            <label for="childBirthday" class="form-label">Дата рождения ребенка</label>
            <input type="date" id="childBirthday" name="childBirthday" class="form-input" required>
          </div>
          <button type="submit" class="form-submit">Отправить заявку</button>
        </form>
      </div>
    </div>
  `;

    initFormHandlers(app);

    // Слушаем событие обновления выбранных услуг для формы
    document.addEventListener('updateFormSelectedServices', () => {
        updateFormSelectedServices(app);
    });
}

function initFormHandlers(app) {
    const form = document.getElementById('consultationForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = this.querySelector('#name');
        const phone = this.querySelector('#phone');
        const eventDate = this.querySelector('#eventDate');
        const childBirthday = this.querySelector('#childBirthday');

        let isValid = true;

        // Валидация имени
        if (!name.value.trim()) {
            name.style.borderColor = 'red';
            isValid = false;
        } else {
            name.style.borderColor = '';
        }

        // Валидация телефона
        if (!phone.value.match(/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/)) {
            phone.style.borderColor = 'red';
            isValid = false;
        } else {
            phone.style.borderColor = '';
        }

        // Валидация дат
        if (!eventDate.value) {
            eventDate.style.borderColor = 'red';
            isValid = false;
        } else {
            eventDate.style.borderColor = '';
        }

        if (!childBirthday.value) {
            childBirthday.style.borderColor = 'red';
            isValid = false;
        } else {
            childBirthday.style.borderColor = '';
        }

        if (isValid && app.state.currentPackage) {
            try {
                const formData = {
                    name: name.value,
                    phone: phone.value,
                    email: '',
                    eventDate: eventDate.value,
                    childBirthday: childBirthday.value,
                    packageType: app.state.currentPackage,
                    characters: app.state.selectedCharacters,
                    shows: app.state.selectedShows,
                    masterClasses: app.state.selectedMasterClasses,
                    products: app.state.selectedProducts,
                    additionalServices: app.state.selectedAdditionalServices,
                    total: document.getElementById('total-price')?.textContent || '0'
                };

                await submitBooking(formData);
                showNotification('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                form.reset();
                app.removePackage(); // Сбрасываем выбор пакета
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification(error.message || 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже.', 'error');
            }
        } else if (!app.state.currentPackage) {
            showNotification('Пожалуйста, выберите пакет услуг', 'error');
        } else {
            showNotification('Пожалуйста, заполните все обязательные поля корректно', 'error');
        }
    });
}

function updateFormSelectedServices(app) {
    const formServices = document.getElementById('form-selected-services');
    if (!formServices) return;

    let html = '<h4>Выбранные услуги:</h4><div class="selected-items">';

    // Пакет
    html += `<div class="selected-item">Пакет: ${getPackageName(app.state.currentPackage)} <span>${document.getElementById('total-price')?.textContent || '0'}₽</span></div>`;

    // Персонажи
    if (app.state.selectedCharacters.length > 0) {
        app.state.selectedCharacters.forEach(char => {
            if (app.state.currentPackage === 'custom') {
                html += `<div class="selected-item">${char.name} <span>${app.customPrices.character}₽</span></div>`;
            } else {
                html += `<div class="selected-item">${char.name}</div>`;
            }
        });
    }

    // Шоу
    if (app.state.selectedShows.length > 0) {
        app.state.selectedShows.forEach(show => {
            if (app.state.currentPackage === 'custom') {
                html += `<div class="selected-item">${show.name} <span>${app.customPrices.show}₽</span></div>`;
            } else {
                html += `<div class="selected-item">${show.name}</div>`;
            }
        });
    }

    // Мастер-классы
    if (app.state.selectedMasterClasses.length > 0) {
        app.state.selectedMasterClasses.forEach(master => {
            if (app.state.currentPackage === 'custom') {
                html += `<div class="selected-item">${master.name} <span>${app.customPrices.master}₽</span></div>`;
            } else {
                html += `<div class="selected-item">${master.name}</div>`;
            }
        });
    }

    // Товары
    if (app.state.selectedProducts.length > 0) {
        app.state.selectedProducts.forEach(prod => {
            let price = prod.price;
            if (app.state.currentPackage === 'custom') {
                if (prod.id === 'photo') price = app.customPrices.products.photo;
                else if (prod.id === 'decor') price = app.customPrices.products.decor;
                else if (prod.id === 'pinata') price = app.customPrices.products.pinata;
                html += `<div class="selected-item">${prod.name} <span>${price}₽</span></div>`;
            } else {
                html += `<div class="selected-item">${prod.name}</div>`;
            }
        });
    }

    // Дополнительные услуги
    if (app.state.selectedAdditionalServices.length > 0) {
        app.state.selectedAdditionalServices.forEach(serv => {
            let price = serv.price;
            if (app.state.currentPackage === 'custom') {
                if (serv.id === 'photographer') price = app.customPrices.products.photo;
                else if (serv.id === 'pinata') price = app.customPrices.products.pinata;
                else if (serv.id === 'cake') price = 0;
                html += `<div class="selected-item">${serv.name} <span>${price}₽</span></div>`;
            } else {
                html += `<div class="selected-item">${serv.name}</div>`;
            }
        });
    }

    html += '</div>';
    formServices.innerHTML = html;
}

function getPackageName(packageType) {
    const names = {
        basic: 'Базовый',
        standard: 'Стандарт',
        premium: 'Премиум',
        custom: 'Кастомный'
    };
    return names[packageType] || '';
}