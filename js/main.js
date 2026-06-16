import { generatePhotos } from './data.js';

const photos = generatePhotos();
window.photos = photos;
console.log('Generated', photos.length, 'photos');
