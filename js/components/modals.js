import { showNotification } from '../modules/ui.js';
import { submitCharacterRequest } from '../modules/api.js';

export function initModals(app) {
    const modalsContainer = document.querySelector('[data-component="modals"]');
    if (!modalsContainer) return;

    modalsContainer.innerHTML = `
    <!-- Модальное окно для видео -->
    <div class="modal-overlay" id="video-modal">
      <div class="modal-content video-modal">
        <button class="close-modal">&times;</button>
        <div class="modal-body">
          <video controls id="modal-video">
            Ваш браузер не поддерживает видео.
          </video>
          <div id="video-modal-title" class="video-title"></div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для пожелания персонажа -->
    <div class="modal-overlay" id="wish-character-modal">
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="modal-body">
          <h3>Какого персонажа вы бы хотели увидеть?</h3>
          <form id="wish-character-form">
            <div class="form-group">
              <label for="wish-name" class="form-label">Ваше имя</label>
              <input type="text" id="wish-name" name="wish-name" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="wish-character" class="form-label">Желаемый персонаж</label>
              <input type="text" id="wish-character" name="wish-character" class="form-input" required>
            </div>
            <button type="submit" class="form-submit">Отправить</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра изображений -->
    <div class="modal-overlay" id="image-modal">
      <div class="modal-content">
        <button class="close-modal">&times;</button>
        <div class="modal-body">
          <img id="image-modal-img" src="" alt="" style="max-width: 100%; max-height: 80vh;">
          <div id="image-modal-caption" class="video-title" style="margin-top: 15px;"></div>
        </div>
      </div>
    </div>
  `;

    initModalHandlers();
    initModalEvents();
}

function initModalHandlers() {
    // Закрытие модальных окон
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal-overlay').forEach(modal => {
                modal.classList.remove('active');
            });

            // Останавливаем видео при закрытии
            const video = document.getElementById('modal-video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });

    // Закрытие по клику на оверлей
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');

                // Останавливаем видео при закрытии
                const video = document.getElementById('modal-video');
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            }
        });
    });

    // Обработчик формы пожелания персонажа
    const wishForm = document.getElementById('wish-character-form');
    if (wishForm) {
        wishForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('wish-name').value.trim();
            const character = document.getElementById('wish-character').value.trim();

            if (!name || !character) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                return;
            }

            try {
                await submitCharacterRequest({
                    name: name,
                    character: character,
                    date: new Date().toISOString()
                });

                showNotification('Спасибо! Мы учтём ваше пожелание.', 'success');
                document.getElementById('wish-character-modal').classList.remove('active');
                wishForm.reset();
            } catch (error) {
                showNotification('Спасибо! Мы учтём ваше пожелание.', 'success');
                document.getElementById('wish-character-modal').classList.remove('active');
                wishForm.reset();
            }
        });
    }
}

function initModalEvents() {
    // Показ видео-модалки
    document.addEventListener('showVideoModal', (event) => {
        const { videoUrl, title } = event.detail;
        const modal = document.getElementById('video-modal');
        const video = document.getElementById('modal-video');
        const videoTitle = document.getElementById('video-modal-title');

        if (modal && video && videoTitle) {
            video.src = videoUrl;
            videoTitle.textContent = title;
            modal.classList.add('active');
        }
    });

    // Показ модалки пожелания персонажа
    document.addEventListener('openSuggestionModal', (event) => {
        const character = event.detail || '';
        const modal = document.getElementById('wish-character-modal');
        const characterInput = document.getElementById('wish-character');

        if (modal && characterInput) {
            characterInput.value = character;
            modal.classList.add('active');
            document.getElementById('wish-name').focus();
        }
    });

    // Показ модалки изображения
    document.addEventListener('openImageModal', (event) => {
        const { src, caption } = event.detail;
        const modal = document.getElementById('image-modal');
        const img = document.getElementById('image-modal-img');
        const imgCaption = document.getElementById('image-modal-caption');

        if (modal && img && imgCaption) {
            img.src = src;
            img.alt = caption;
            imgCaption.textContent = caption;
            modal.classList.add('active');
        }
    });
}