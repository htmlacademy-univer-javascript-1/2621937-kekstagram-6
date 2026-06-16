import { fetchPhotos } from './api.js';

/**
 * Загружает фотографии с сервера
 * @returns {Promise<Array>} Массив объектов фотографий
 */
export function getPhotos() {
  return fetchPhotos();
}
