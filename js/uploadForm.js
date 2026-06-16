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
  initScaleControls();
  initEffects();
};

// Image editing: scale and effects
const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;

function initScaleControls() {
  if (!uploadForm) return;
  const scaleSmaller = uploadForm.querySelector('.scale__control--smaller');
  const scaleBigger = uploadForm.querySelector('.scale__control--bigger');
  const scaleValue = uploadForm.querySelector('.scale__control--value');
  const previewImg = uploadForm.querySelector('.img-upload__preview img');

  if (!scaleSmaller || !scaleBigger || !scaleValue || !previewImg) return;

  const parseValue = (val) => parseInt(String(val).replace('%', ''), 10);
  const applyScale = (value) => {
    const clamped = Math.min(SCALE_MAX, Math.max(SCALE_MIN, value));
    scaleValue.value = `${clamped}%`;
    previewImg.style.transform = `scale(${(clamped / 100).toFixed(2)})`;
  };

  scaleSmaller.addEventListener('click', () => {
    const current = parseValue(scaleValue.value) || SCALE_MAX;
    applyScale(current - SCALE_STEP);
  });

  scaleBigger.addEventListener('click', () => {
    const current = parseValue(scaleValue.value) || SCALE_MAX;
    applyScale(current + SCALE_STEP);
  });

  // initialize
  applyScale(parseValue(scaleValue.value) || SCALE_MAX);
}

function initEffects() {
  if (!uploadForm) return;
  const effectsRadios = Array.from(uploadForm.querySelectorAll('.effects__radio'));
  const effectLevelContainer = uploadForm.querySelector('.img-upload__effect-level');
  const effectLevelValue = uploadForm.querySelector('.effect-level__value');
  const effectSliderElem = uploadForm.querySelector('.effect-level__slider');
  const previewImg = uploadForm.querySelector('.img-upload__preview img');

  if (!effectLevelContainer || !effectLevelValue || !effectSliderElem || !previewImg) return;

  const EFFECTS = {
    none: null,
    chrome: {range: {min: 0, max: 1}, step: 0.1, format: (v) => `${v}` , css: (v) => `grayscale(${v})`},
    sepia: {range: {min: 0, max: 1}, step: 0.1, format: (v) => `${v}` , css: (v) => `sepia(${v})`},
    marvin: {range: {min: 0, max: 100}, step: 1, format: (v) => `${v}` , css: (v) => `invert(${v}%)`},
    phobos: {range: {min: 0, max: 3}, step: 0.1, format: (v) => `${v}` , css: (v) => `blur(${v}px)`},
    heat: {range: {min: 1, max: 3}, step: 0.1, format: (v) => `${v}` , css: (v) => `brightness(${v})`},
  };

  let slider = null;

  const showSlider = (show) => {
    if (show) {
      effectLevelContainer.classList.remove('hidden');
    } else {
      effectLevelContainer.classList.add('hidden');
    }
  };

  const setFilter = (effectName, value) => {
    if (effectName === 'none' || !EFFECTS[effectName]) {
      previewImg.style.filter = '';
      return;
    }
    const effect = EFFECTS[effectName];
    previewImg.style.filter = effect.css(value);
  };

  const setEffectLevelValue = (effectName, rawValue) => {
    // store percent 0..100 for form
    if (effectName === 'none' || !EFFECTS[effectName]) {
      effectLevelValue.value = 100;
      return;
    }
    const effect = EFFECTS[effectName];
    const min = effect.range.min;
    const max = effect.range.max;
    const percent = Math.round(((Number(rawValue) - min) / (max - min)) * 100);
    // For marvin (0..100) percent equals raw value
    effectLevelValue.value = (effectName === 'marvin') ? Math.round(Number(rawValue)) : percent;
  };

  const onSliderUpdate = (values, handle, effectName) => {
    const raw = Number(values[handle]);
    setFilter(effectName, raw);
    setEffectLevelValue(effectName, raw);
  };

  const initSliderFor = (effectName) => {
    const config = EFFECTS[effectName];
    if (!config) return;

    const options = {
      start: config.range.max,
      connect: 'lower',
      step: config.step,
      range: {
        min: config.range.min,
        max: config.range.max,
      },
    };

    if (typeof noUiSlider !== 'undefined' && effectSliderElem) {
      if (slider) {
        // update existing slider
        slider.noUiSlider.updateOptions(options);
        slider.noUiSlider.set(config.range.max);
        slider.noUiSlider.off();
        slider.noUiSlider.on('update', (values, handle) => onSliderUpdate(values, handle, effectName));
      } else {
        noUiSlider.create(effectSliderElem, options);
        slider = effectSliderElem;
        slider.noUiSlider.on('update', (values, handle) => onSliderUpdate(values, handle, effectName));
      }
    } else {
      // Fallback: no slider library available — immediately apply max effect
      setFilter(effectName, config.range.max);
      setEffectLevelValue(effectName, config.range.max);
    }
  };

  // effect change handler
  effectsRadios.forEach((radio) => {
    radio.addEventListener('change', (evt) => {
      const selected = evt.target.value;
      // reset level to initial (100%)
      effectLevelValue.value = 100;
      if (selected === 'none') {
        showSlider(false);
        setFilter('none');
      } else {
        showSlider(true);
        initSliderFor(selected);
      }
    });
  });

  // initialize default state
  const checked = effectsRadios.find((r) => r.checked) || effectsRadios[0];
  if (checked && checked.value === 'none') {
    showSlider(false);
    setFilter('none');
  } else if (checked) {
    showSlider(true);
    initSliderFor(checked.value);
  }
}
