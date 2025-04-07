const routes = {
    'home': 'home',
    'about': 'about',
    'products': 'products',
    'contact': 'contact'
};

const pages = document.querySelectorAll('.page');

function navigate() {
    
    const hash = window.location.hash.slice(1) || 'home';
    const pageId = routes[hash] || 'home'; 

    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === pageId) {
            page.classList.add('active');
        }
    });

    
    document.title = `SPA - ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;
}

navigate();

window.addEventListener('hashchange', navigate);

window.addEventListener('popstate', navigate);

if (!window.location.hash) {
    window.location.hash = '#home';
}