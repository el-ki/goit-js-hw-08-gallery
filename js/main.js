// Создай галерею с возможностью клика по ее элементам и просмотра полноразмерного изображения в модальном окне.
// Разбей задание на несколько подзадач:

// Создание и рендер разметки по массиву данных и предоставленному шаблону.
// Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.
// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, 
// чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

// Стартовые файлы
// В папке src ты найдешь стартовые файлы проекта с базовой разметкой и готовыми стилями.
// В файле gallery-items.js есть массив объектов содержащих информацию о изображениях: маленькое изображение, оригинальное и описание.
// Разметка элемента галереи
// Ссылка на оригинальное изображение должна храниться в data-атрибуте source на элементе img, и указываться в href ссылки (это необходимо для доступности).

// <li class="gallery__item">
//   <a
//     class="gallery__link"
//     href="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg"
//   >
//     <img
//       class="gallery__image"
//       src="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546__340.jpg"
//       data-source="https://cdn.pixabay.com/photo/2010/12/13/10/13/tulips-2546_1280.jpg"
//       alt="Tulips"
//     />
//   </a>
// </li>
// Дополнительно
// Следующий функционал не обязателен при сдаче задания, но будет хорошей практикой по работе с событиями.

// Закрытие модального окна по клику на div.lightbox__overlay.
// Закрытие модального окна по нажатию клавиши ESC.
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

// Создание и рендер разметки по массиву данных и предоставленному шаблону.
import galleryItems from './gallery-items.js';

const refs = {
    ulGallery: document.querySelector('.js-gallery'),
    largeImg: document.querySelector('.lightbox__image'),
    openModal: document.querySelector('.js-lightbox'),
    closeModalBtn: document.querySelector('button[data-action="close-lightbox"]'),
    closeModalOverlay: document.querySelector('.lightbox__overlay'),
}

let initialIndex = -1;

const createsItemMarkup = item => {
    const liRef = document.createElement('li');
    liRef.classList.add('gallery__item');
    const aRef = document.createElement('a');
    aRef.classList.add('gallery__link');
    aRef.href = `${item.original}`;
    const imgRef = document.createElement('img');
    imgRef.classList.add('gallery__image');
    imgRef.src = `${item.preview}`;
    imgRef.setAttribute('data-source', `${item.original}`);
    imgRef.alt = `${item.description}`;
    imgRef.setAttribute('data-index', `${initialIndex += 1}`);
    aRef.appendChild(imgRef);
    liRef.appendChild(aRef);
    return liRef;
};

const galleryItemMarkup = galleryItems.map(item => createsItemMarkup(item));
refs.ulGallery.append(...galleryItemMarkup)

console.log(refs.ulGallery);

//Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// Открытие модального окна по клику на элементе галереи.
// Подмена значения атрибута src элемента img.lightbox__image.

refs.ulGallery.addEventListener('click', onOpenModal);

function onOpenModal(event) {
    event.preventDefault();
    window.addEventListener('keydown', onPressKey);
    refs.closeModalBtn.addEventListener('click', onCloseModal);
    refs.closeModalOverlay.addEventListener('click', onCloseModal);
    if (event.target.nodeName !== 'IMG') return;
    const imgRef = event.target;
    const largeImgURL = imgRef.dataset.source;
    refs.largeImg.alt = imgRef.alt;
    refs.largeImg.setAttribute('data-index', `${imgRef.dataset.index}`)
    refs.openModal.classList.add('is-open');
    setLargeImgSrc(largeImgURL);
}

function setLargeImgSrc(url) { 
    refs.largeImg.src = url;
}

// Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// Закрытие модального окна по клику на div.lightbox__overlay - *реализовано в onOpenModal, снято в onCloseModal*
// Очистка значения атрибута src элемента img.lightbox__image - *реализовано в onOpenModal, снято в onCloseModal*

const onCloseModal = () => { 
    window.removeEventListener('keydown', onPressKey);
    refs.closeModalBtn.removeEventListener('click', onCloseModal);
    refs.closeModalOverlay.removeEventListener('click', onCloseModal);
    refs.openModal.classList.remove('is-open');
    refs.largeImg.src = '';
    refs.largeImg.alt = '';
}

// Закрытие модального окна по нажатию клавиши ESC.
const onPressKey = (event) => {
    if (event.code === 'Escape') {
        onCloseModal();
    } if (event.code === 'ArrowLeft') { 
        onMoveLeft()
    } if (event.code === 'ArrowRight') { 
        onMoveRight()
    }
}
// Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

const onMoveLeft = () => {
    const previousIndex = refs.largeImg.dataset.index - 1;
    if (previousIndex < 0) return;
    refs.largeImg.dataset.index = previousIndex;
    const previousImg = galleryItems[previousIndex].original;
    setLargeImgSrc(previousImg);

};

const onMoveRight = () => {
    const nextIndex = Number(refs.largeImg.dataset.index) + 1;
    if (nextIndex > galleryItems.length - 1) return;
    refs.largeImg.dataset.index = nextIndex;
    const nextImg = galleryItems[nextIndex].original;
    setLargeImgSrc(nextImg);
};

        