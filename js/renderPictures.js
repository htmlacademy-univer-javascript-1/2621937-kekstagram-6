import { getPhotos } from './data.js';
import { openBigPicture } from './bigPicture.js';
import { debounce, shuffleArray } from './util.js';

function createPictureElement(photo, template) {
  const pictureElement = template.cloneNode(true);
  const image = pictureElement.querySelector('.picture__img');
  const likesElement = pictureElement.querySelector('.picture__likes');
  const commentsElement = pictureElement.querySelector('.picture__comments');

  image.src = photo.url;
  image.alt = photo.description;
  likesElement.textContent = photo.likes;
  commentsElement.textContent = photo.comments.length;

  pictureElement.addEventListener('click', (evt) => {
    evt.preventDefault();
    openBigPicture(photo);
  });

  return pictureElement;
}

export function renderPictures(photos) {
  const picturesContainer = document.querySelector('.pictures');
  const template = document.querySelector('#picture').content.querySelector('.picture');

  if (!picturesContainer || !template) {
    return;
  }

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    fragment.appendChild(createPictureElement(photo, template));
  });

  picturesContainer.appendChild(fragment);
}

function clearPictures() {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }
  const rendered = picturesContainer.querySelectorAll('.picture, .error-message');
  rendered.forEach((node) => node.remove());
}

function showFilters() {
  const filters = document.querySelector('.img-filters');
  if (!filters) {
    return;
  }
  filters.classList.remove('img-filters--inactive');
}

function getFilteredPhotos(filterId, photos) {
  if (!Array.isArray(photos)) {
    return [];
  }
  switch (filterId) {
    case 'filter-random': {
      return shuffleArray(photos).slice(0, 10);
    }
    case 'filter-discussed': {
      return photos.slice().sort((a, b) => b.comments.length - a.comments.length);
    }
    case 'filter-default':
    default:
      return photos;
  }
}

function setActiveButton(activeButton) {
  const buttons = document.querySelectorAll('.img-filters__button');
  buttons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  if (activeButton) {
    activeButton.classList.add('img-filters__button--active');
  }
}

/**
 * Показывает сообщение об ошибке загрузки фотографий
 * @param {string} message - Текст ошибки
 */
function showErrorMessage(message) {
  const picturesContainer = document.querySelector('.pictures');
  if (!picturesContainer) {
    return;
  }

  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.style.cssText = `
    padding: 20px;
    margin: 20px 0;
    background-color: #fff5f5;
    border: 2px solid #ff6b6b;
    border-radius: 8px;
    color: #ff6b6b;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  `;
  errorDiv.textContent = message;

  picturesContainer.appendChild(errorDiv);
}

export async function initializeGallery() {
  try {
    const photos = await getPhotos();
    renderPictures(photos);
    window.photos = photos;

    // Показываем панель фильтров и вешаем обработчики с устранением дребезга
    showFilters();

    const updatePictures = (filterId) => {
      const currentPhotos = window.photos || [];
      const filtered = getFilteredPhotos(filterId, currentPhotos);
      clearPictures();
      renderPictures(filtered);
    };

    const debouncedUpdate = debounce(updatePictures, 500);

    const filtersForm = document.querySelector('.img-filters__form');
    if (filtersForm) {
      filtersForm.addEventListener('click', (evt) => {
        const target = evt.target;
        if (!target.classList.contains('img-filters__button')) {
          return;
        }
        const id = target.id || 'filter-default';
        setActiveButton(target);
        debouncedUpdate(id);
      });
    }
  } catch (error) {
    console.error('Ошибка при загрузке фотографий:', error);
    showErrorMessage(error.message);
  }
}
