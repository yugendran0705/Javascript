const animeList = document.getElementById('animeList');
const loading = document.getElementById('loading');
let page = 1;
let isLoading = false;

const query = `
            query ($page: Int, $perPage: Int) {
                Page(page: $page, perPage: $perPage) {
                    media(type: ANIME, sort: POPULARITY_DESC) {
                        id
                        title {
                            romaji
                            english
                        }
                        description
                        bannerImage 
                        coverImage{medium}
                    }
                }
            }
        `;

async function fetchAnime() {
    if (isLoading) return;
    isLoading = true;
    loading.classList.add('active');

    const variables = {
        page: page,
        perPage: 10
    };

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        });

        const data = await response.json();
        console.log(data);
        const animeData = data.data.Page.media;

        appendAnime(animeData);
        page++;
    } catch (error) {
        console.error('Error fetching anime:', error);
    } finally {
        isLoading = false;
        loading.classList.remove('active');
    }
}

function appendAnime(animeData) {
    animeData.forEach(anime => {
        const div = document.createElement('div');
        div.className = 'anime-item';

        const title = anime.title.english || anime.title.romaji;
        const description = anime.description
            ? anime.description.replace(/<[^>]+>/g, '')
            : 'No description available';

        div.innerHTML = `
                    <img class="cover" src="${anime.coverImage.medium}" alt="${title}" />
                    <h2 class="title" >${title}</h2>
                    <p class="description" >${description.substring(0, 150)}...</p>
                `;
        animeList.appendChild(div);
    });
}

function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.offsetHeight - 100;

    if (scrollPosition >= bottomPosition && !isLoading) {
        fetchAnime();
    }
}

fetchAnime();

window.addEventListener('scroll', handleScroll);