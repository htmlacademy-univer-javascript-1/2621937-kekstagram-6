const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImage = bigPictureElement?.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement?.querySelector('.likes-count');
const commentsCountElement = bigPictureElement?.querySelector('.comments-count');
const commentsListElement = bigPictureElement?.querySelector('.social__comments');
const captionElement = bigPictureElement?.querySelector('.social__caption');
const commentsCountBlock = bigPictureElement?.querySelector('.social__comment-count');
const commentsLoaderButton = bigPictureElement?.querySelector('.comments-loader');
const closeButton = bigPictureElement?.querySelector('.big-picture__cancel');

function createCommentElement(comment) {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatar = document.createElement('img');
  avatar.classList.add('social__picture');
  avatar.src = comment.avatar;
  avatar.alt = comment.name;
  avatar.width = 35;
  avatar.height = 35;

  const text = document.createElement('p');
  text.classList.add('social__text');
  text.textContent = comment.message;

  commentElement.appendChild(avatar);
  commentElement.appendChild(text);

  return commentElement;
}

function clearComments() {
  if (commentsListElement) {
    commentsListElement.innerHTML = '';
  }
}

function closeBigPicture() {
  if (!bigPictureElement) {
    return;
  }

  bigPictureElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closeBigPicture();
  }
}

function onCloseButtonClick(evt) {
  evt.preventDefault();
  closeBigPicture();
}

export function openBigPicture(photo) {
  if (!bigPictureElement || !photo) {
    return;
  }

  if (bigPictureImage) {
    bigPictureImage.src = photo.url;
    bigPictureImage.alt = photo.description;
  }

  if (likesCountElement) {
    likesCountElement.textContent = photo.likes;
  }

  if (commentsCountElement) {
    commentsCountElement.textContent = photo.comments.length;
  }

  if (captionElement) {
    captionElement.textContent = photo.description;
  }

  if (commentsCountBlock) {
    commentsCountBlock.classList.add('hidden');
  }

  if (commentsLoaderButton) {
    commentsLoaderButton.classList.add('hidden');
  }

  clearComments();

  if (commentsListElement) {
    photo.comments.forEach((comment) => {
      commentsListElement.appendChild(createCommentElement(comment));
    });
  }

  bigPictureElement.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

if (closeButton) {
  closeButton.addEventListener('click', onCloseButtonClick);
}
