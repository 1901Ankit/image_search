import axios from 'axios';

// const PIXABAY_API_KEY = 'k2Byps0p92SpwOQogyBVMP9eIfKpnRiuO4BU11jMH9REk16khiarQfMT'; 
const PIXABAY_API_KEY = '49701484-40ec5218589a3258d3d89559c'; 
const PIXABAY_API_URL = 'https://pixabay.com/api/';

export const searchImages = async (query) => {
  try {
    const response = await axios.get(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: query,
        per_page: 30,
        image_type: 'photo',
        safesearch: true,
      },
    });
    console.log('Response:', response);
    return response.data.hits.map(hit => ({
      id: hit.id,
      urls: {
        regular: hit.largeImageURL,
        small: hit.webformatURL,
      },
      alt_description: hit.tags,
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};