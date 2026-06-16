import { getRandomInt, getRandomItem } from './util.js';

const PHOTOS_COUNT = 25;

const NAMES = [
  'Артём', 'Мария', 'Ирина', 'Олег', 'Виктор', 'Светлана', 'Дмитрий', 'Екатерина', 'Никита', 'Алексей', 'Ольга', 'Сергей'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

function makeMessage() {
  const sentencesCount = getRandomInt(1, 2);
  const parts = [];

  for (let i = 0; i < sentencesCount; i++) {
    parts.push(getRandomItem(MESSAGES));
  }

  return parts.join(' ');
}

let commentId = 1000;

function createComment() {
  return {
    id: commentId++,
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: makeMessage(),
    name: getRandomItem(NAMES)
  };
}

export function generatePhotos() {
  const photos = [];

  for (let i = 1; i <= PHOTOS_COUNT; i++) {
    const commentsCount = getRandomInt(0, 30);
    const comments = [];

    for (let j = 0; j < commentsCount; j++) {
      comments.push(createComment());
    }

    photos.push({
      id: i,
      url: `photos/${i}.jpg`,
      description: `Описание фотографии ${i}`,
      likes: getRandomInt(15, 200),
      comments
    });
  }

  return photos;
}
