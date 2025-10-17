export function initReviews(app) {
    const reviewsSection = document.querySelector('[data-component="reviews"]');
    if (!reviewsSection) return;

    reviewsSection.innerHTML = `
    <div class="section-inner">
      <h2>Наши работы</h2>
      <p class="subtitle">Реальные фото с мероприятий</p>
      
      <div class="reviews-container">
        <div class="reviews-grid" id="reviews-grid"></div>
        
        <div class="load-more-container">
          <button class="load-more-btn" id="load-more-reviews">
            <span>Показать еще</span>
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  `;

    renderReviewPhotos(app);
    initLoadMoreHandler(app);
    initReviewPhotoHandlers();
}

function renderReviewPhotos(app) {
    const reviewsGrid = document.getElementById('reviews-grid');
    if (!reviewsGrid) return;

    const photosToShow = app.reviews.slice(0, app.state.visiblePhotosCount);

    reviewsGrid.innerHTML = photosToShow.map((photo, index) => {
        const isNew = index >= app.state.visiblePhotosCount - 4;
        return `
      <div class="review-photo-card ${isNew ? 'new' : ''}" data-photo-id="${photo.id}">
        <img src="${photo.image}" alt="${photo.title}" class="review-photo" loading="lazy">
        <div class="photo-overlay">
          <div class="photo-info">
            <div class="photo-title">${photo.title}</div>
            <div class="photo-date">${photo.date}</div>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Скрываем кнопку если все фото показаны
    const loadMoreBtn = document.getElementById('load-more-reviews');
    if (loadMoreBtn) {
        if (app.state.visiblePhotosCount >= app.reviews.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
}

function initLoadMoreHandler(app) {
    const loadMoreBtn = document.getElementById('load-more-reviews');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', () => {
        app.state.visiblePhotosCount += 4;
        renderReviewPhotos(app);

        // Плавная прокрутка к новым фото
        setTimeout(() => {
            const newPhotos = document.querySelectorAll('.review-photo-card.new');
            if (newPhotos.length > 0) {
                newPhotos[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 100);
    });
}

function initReviewPhotoHandlers() {
    document.addEventListener('click', (e) => {
        const photoCard = e.target.closest('.review-photo-card');
        if (photoCard) {
            const img = photoCard.querySelector('.review-photo');
            const title = photoCard.querySelector('.photo-title').textContent;

            if (img) {
                document.dispatchEvent(new CustomEvent('openImageModal', {
                    detail: {
                        src: img.src,
                        caption: title
                    }
                }));
            }
        }
    });
}