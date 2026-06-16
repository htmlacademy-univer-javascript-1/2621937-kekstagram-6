const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

/**
 * Загружает список фотографий с сервера
 * @returns {Promise<Array>} Массив объектов фотографий
 */
export async function fetchPhotos() {
  try {
    const response = await fetch(`${BASE_URL}/data`);
    
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось загрузить фотографии: ${error.message}`);
  }
}

/**
 * Отправляет данные формы на сервер
 * @param {FormData} formData - Данные формы
 * @returns {Promise<Object>} Ответ сервера
 */
export async function sendFormData(formData) {
  try {
    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Не удалось отправить фотографию: ${error.message}`);
  }
}
