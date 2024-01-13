import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const searchForm = document.querySelector('.form');
const galleryContainer = document.querySelector('.gallery');
const loaderElement = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');

let searchParamsDefaults = {
  key: '41751590-b6ce5e955eace60263a904c25',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 40,
};

function showLoaderAndHideGallery() {
  loaderElement.style.display = 'block';
  galleryContainer.style.display = 'none';
  loadMoreBtn.style.display = 'none';
}

function hideLoaderAndShowGallery() {
  loaderElement.style.display = 'none';
  galleryContainer.style.display = 'flex';
  loadMoreBtn.style.display = 'block';
}

function generateGalleryHTML(hits) {
  return hits.reduce((html, hit) => {
    const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = hit;
    return (
      html +
      `<li class="gallery-item">
        <a href=${largeImageURL}> 
          <img class="gallery-img" src=${webformatURL} alt=${tags} />
        </a>
        <div class="gallery-text-box">
          <p>Likes: <span class="text-value">${likes}</span></p>
          <p>views: <span class="text-value">${views}</span></p>
          <p>comments: <span class="text-value">${comments}</span></p>
          <p>downloads: <span class="text-value">${downloads}</span></p>
        </div>
      </li>`
    );
  }, '');
}

function renderGallery(hits) {
  const galleryHTML = generateGalleryHTML(hits);
  galleryContainer.innerHTML += galleryHTML; 
}

function initializeImageLightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    nav: true,
    captionDelay: 250,
    captionsData: 'alt',
    close: true,
    enableKeyboard: true,
    docClose: true,
  });
  lightbox.refresh();
}

function handleNoResults() {
  galleryContainer.style.display = 'none';
  loadMoreBtn.style.display = 'none';
  iziToast.error({
    position: 'topRight',
    color: 'red',
    message: 'Sorry, there are no images matching your search query. Please try again!',
  });
}

function handleEndOfCollection() {
  loadMoreBtn.style.display = 'none';
  iziToast.info({
    position: 'topRight',
    message: "We're sorry, but you've reached the end of search results.",
  });
}

async function searchImages(params) {
  showLoaderAndHideGallery();

  try {
    const response = await axios.get(`https://pixabay.com/api/?${params}`);
    hideLoaderAndShowGallery();

    if (!response.data.totalHits || response.data.totalHits === 0) {
      handleNoResults();
    } else {
      renderGallery(response.data.hits);
      initializeImageLightbox();
      searchParamsDefaults.page++; 
    }

    // Перевірка на кінець колекції
    const totalHits = response.data.totalHits || 0;
    const currentPage = searchParamsDefaults.page || 1;
    const perPage = searchParamsDefaults.per_page || 20;
    const remainingHits = totalHits - currentPage * perPage;

    if (remainingHits <= 0) {
      handleEndOfCollection();
    }
  } catch (error) {
    console.error(error);

    if (axios.isAxiosError(error)) {
      const { response, request } = error;

      if (response) {
        iziToast.error({
          position: 'topRight',
          color: 'red',
          message: `Server responded with an error: ${response.statusText}`,
        });
      } else if (request) {
        iziToast.error({
          position: 'topRight',
          color: 'red',
          message: 'Network error. Please try again later.',
        });
      } else {
      // Інші помилки
      iziToast.error({
        position: 'topRight',
        color: 'red',
        message: 'An unexpected error occurred. Please try again later.',
      });
    }

    hideLoaderAndShowGallery();
    handleNoResults();
  }
}


searchForm.addEventListener('submit', event => {
  event.preventDefault();
  searchParamsDefaults.q = event.target.elements.search.value.trim();
  searchParamsDefaults.page = 1; // Скидаємо сторінку при новому пошуку
  const searchParams = new URLSearchParams(searchParamsDefaults);
  searchImages(searchParams);
  event.currentTarget.reset();
});

loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  const searchParams = new URLSearchParams(searchParamsDefaults);
  searchImages(searchParams);
});
