const uploadForm = document.querySelector('.img-upload__form');
const uploadFileInput = uploadForm?.querySelector('.img-upload__input');
const uploadOverlay = uploadForm?.querySelector('.img-upload__overlay');
const uploadCancelButton = uploadForm?.querySelector('.img-upload__cancel');
const hashtagsInput = uploadForm?.querySelector('.text__hashtags');
const descriptionInput = uploadForm?.querySelector('.text__description');

const HASHTAG_MAX_COUNT = 5;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_PATTERN = /^#[A-Za-zА-Яа-яЁё0-9]+$/;

const body = document.body;
let pristine = null;

const getHashtags = (value) => {
  return value
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);
};

const isHashtagsCountValid = (hashtags) => hashtags.length <= HASHTAG_MAX_COUNT;

const areHashtagsUnique = (hashtags) => {
  const lowercased = hashtags.map((tag) => tag.toLowerCase());
  return new Set(lowercased).size === lowercased.length;
};

const isHashtagFormatValid = (hashtag) => {
  return HASHTAG_PATTERN.test(hashtag) && hashtag.length <= HASHTAG_MAX_LENGTH;
};

const validateHashtags = (value) => {
  const hashtags = getHashtags(value);
  if (hashtags.length === 0) {
    return true;
  }

  if (!isHashtagsCountValid(hashtags) || !areHashtagsUnique(hashtags)) {
    return false;
  }

  return hashtags.every((hashtag) => isHashtagFormatValid(hashtag));
};

const getHashtagsErrorMessage = (value) => {
  const hashtags = getHashtags(value);

  if (hashtags.length > HASHTAG_MAX_COUNT) {
    return 'Нельзя указать больше 5 хэш-тегов.';
  }

  const lowercased = hashtags.map((tag) => tag.toLowerCase());
  if (new Set(lowercased).size !== hashtags.length) {
    return 'Один и тот же хэш-тег не может использоваться дважды.';
  }

  for (const hashtag of hashtags) {
    if (hashtag === '#') {
      return 'Хэш-тег не может состоять только из одной решётки.';
    }

    if (hashtag.length > HASHTAG_MAX_LENGTH) {
      return 'Максимальная длина одного хэш-тега — 20 символов.';
    }

    if (!HASHTAG_PATTERN.test(hashtag)) {
      return 'Хэш-тег должен начинаться с # и содержать только буквы и цифры без пробелов.';
    }
  }

  return 'Неверный формат хэш-тегов.';
};

const validateDescription = (value) => value.length <= 140;

const getDescriptionErrorMessage = () => 'Комментарий не может превышать 140 символов.';

const closeUploadOverlay = () => {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeyDown);
  uploadForm.reset();
  if (uploadFileInput) {
    uploadFileInput.value = '';
  }

  if (pristine) {
    pristine.reset();
  }
};

const openUploadOverlay = () => {
  if (!uploadOverlay) {
    return;
  }

  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeyDown);

  if (pristine) {
    pristine.reset();
  }
};

function onDocumentKeyDown(evt) {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    closeUploadOverlay();
  }
}

const onFileInputChange = () => {
  openUploadOverlay();
};

const onCancelButtonClick = (evt) => {
  evt.preventDefault();
  uploadForm.reset();
  if (uploadFileInput) {
    uploadFileInput.value = '';
  }
  closeUploadOverlay();
};

const onFormSubmit = (evt) => {
  if (pristine && !pristine.validate()) {
    evt.preventDefault();
  }
};

const addFieldFocusHandlers = () => {
  const stopEscPropagation = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.stopPropagation();
    }
  };

  if (hashtagsInput) {
    hashtagsInput.addEventListener('keydown', stopEscPropagation);
  }

  if (descriptionInput) {
    descriptionInput.addEventListener('keydown', stopEscPropagation);
  }
};

const initializeValidation = () => {
  if (!uploadForm || !hashtagsInput || !descriptionInput || typeof Pristine === 'undefined') {
    return;
  }

  pristine = new Pristine(uploadForm, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'p',
    errorTextClass: 'form__error',
  });

  pristine.addValidator(hashtagsInput, validateHashtags, getHashtagsErrorMessage);
  pristine.addValidator(descriptionInput, validateDescription, getDescriptionErrorMessage);

  hashtagsInput.addEventListener('input', () => pristine.validate());
  descriptionInput.addEventListener('input', () => pristine.validate());
};

export const initializeUploadForm = () => {
  if (!uploadForm || !uploadFileInput || !uploadOverlay || !uploadCancelButton) {
    return;
  }

  initializeValidation();
  addFieldFocusHandlers();

  uploadFileInput.addEventListener('change', onFileInputChange);
  uploadCancelButton.addEventListener('click', onCancelButtonClick);
  uploadForm.addEventListener('submit', onFormSubmit);
};
