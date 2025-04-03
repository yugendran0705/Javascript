const images = [
    'https://picsum.photos/800/600?random=1',
    'https://picsum.photos/800/600?random=2',
    'https://picsum.photos/800/600?random=3',
    'https://picsum.photos/800/600?random=4',
    'https://picsum.photos/800/600?random=5',
    'https://picsum.photos/800/600?random=6'
];

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');


function createGallery() {
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Image ${index + 1}`;
        img.className = 'thumbnail';
        img.addEventListener('click', () => openLightbox(src));
        gallery.appendChild(img);
    });
}


function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; 
}


function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}


createGallery();


lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});