document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const clearButton = document.getElementById('clear-button');
    const loadMoreButton = document.getElementById('load-more-button');
    const searchResults = document.getElementById('search-results');
    const form = document.getElementById('search-form');

    let query = '';
    let page = 1;
    let currentResults = [];

    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            query = searchInput.value.trim();
            page = 1;
            searchResults.innerHTML = '';
            currentResults = [];
            loadMoreButton.style.display = 'none';
            if (query) {
                await performSearch(query, page);
            }
        }
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            clearButton.style.display = 'none';
            searchResults.innerHTML = '';
            loadMoreButton.style.display = 'none';
            currentResults = [];
            query = '';
            page = 1;
        } else {
            clearButton.style.display = 'inline-block';
        }
    });

    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        searchResults.innerHTML = '';
        currentResults = [];
        query = '';
        page = 1;
        loadMoreButton.style.display = 'none';
    });

    loadMoreButton.addEventListener('click', async () => {
        page++;
        await performSearch(query, page);
    });

    async function performSearch(query, page) {
        const accessKey = "cIbmBgafc_l2ZfZfgOPKQ9fpArqxiuMWVzi_hUNAhjg";
        let url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${accessKey}`;

        console.log('Fetching URL:', url);

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log('API Response:', data);

            if (response.ok) {
                if (data.results.length === 0 && page === 1) {
                    searchResults.innerHTML = '<p>No results found. Try a different query.</p>';
                } else {
                    currentResults.push(...data.results);
                    displayResults(data.results);

                    if (data.total_pages > page) {
                        loadMoreButton.style.display = 'block';
                    } else {
                        loadMoreButton.style.display = 'none';
                    }
                }
            } else {
                searchResults.innerHTML = `<p>Error: ${data.errors.join(', ')}</p>`;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            searchResults.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        }
    }

    function displayResults(results) {
        results.forEach(result => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('search-result');

            const img = document.createElement('img');
            img.src = result.urls.small;
            img.alt = result.alt_description;
            img.dataset.fullSize = result.urls.full;
            img.dataset.description = result.description || result.alt_description || 'No description available';
            img.addEventListener('click', () => openModal(result));

            const link = document.createElement('a');
            link.href = result.links.html;
            link.target = '_blank';
            link.textContent = result.description || result.alt_description || 'View Image';

            resultDiv.appendChild(img);
            resultDiv.appendChild(link);
            searchResults.appendChild(resultDiv);
        });
    }

    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const downloadButton = document.getElementById('download-button');
    const closeButton = document.getElementsByClassName('close')[0];

    function openModal(result) {
        modal.style.display = 'block';
        modalImg.src = result.urls.full;
        modalCaption.textContent = result.description || result.alt_description || 'No description available';
        downloadButton.href = result.links.download;
    }

    closeButton.onclick = function() {
        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    downloadButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = downloadButton.href;
        link.download = 'download.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
