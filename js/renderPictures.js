import { generatePhotos } from './data.js';
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

export function initializeGallery() {
  const photos = generatePhotos();
  renderPictures(photos);
  window.photos = photos;
  console.log('Generated', photos.length, 'photos');
}
