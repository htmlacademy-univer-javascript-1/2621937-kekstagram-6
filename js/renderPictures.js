import { getPhotos } from './data.js';
import { openBigPicture } from './bigPicture.js';

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
  } catch (error) {
    console.error('Ошибка при загрузке фотографий:', error);
    showErrorMessage(error.message);
  }
}
