let currentPage = 1;
const pageSize = 30; 
let totalGames = 0;
const body = document.querySelector('body');
const paginationWrapper = document.createElement('pagination-wrapper');
body.appendChild(paginationWrapper);

const renderPagination = () => {
    if (!paginationWrapper) return console.error("Pagination wrapper not found!");

    let container = document.querySelector('.pagination-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'pagination-container';
        paginationWrapper.appendChild(container);
    } else {
        container.innerHTML = '';
    }

    const totalPages = Math.min(Math.ceil(totalGames / pageSize), 3);

    const createButton = (text, disabled, onClick, isActive = false) => {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.disabled = disabled;
        if (isActive) btn.classList.add('active');
        btn.addEventListener('click', onClick);
        return btn;
    };

    container.appendChild(createButton('Anterior', currentPage === 1, () => {
        currentPage--;
        consulta('a7d86a316bc643c5b658215fb7395c83', currentPage);
        renderPagination();
    }));

    for (let i = 1; i <= totalPages; i++) {
        container.appendChild(createButton(i, false, () => {
            currentPage = i;
            consulta('a7d86a316bc643c5b658215fb7395c83', currentPage);
            renderPagination();
        }, i === currentPage));
    }

    container.appendChild(createButton('Siguiente', currentPage === totalPages, () => {
        currentPage++;
        consulta('a7d86a316bc643c5b658215fb7395c83', currentPage);
        renderPagination();
    }));
};


const Mostrar = (title, image, released, updated, storesData) => {
    const gridContainer = document.querySelector('.games-grid');
    const div = document.createElement('div');
    div.classList.add('game-card');
    div.innerHTML = `
        <h3>${title}</h3>
        <p>Lanzamiento: ${released}</p>
        <p>Actualización: ${updated}</p>
    `;
    gridContainer.appendChild(div);
    const img = document.createElement("img");
    img.src = image;
    div.appendChild(img);
    img.classList.add('capturas');
    const storesTitle = document.createElement('h4');
    div.appendChild(storesTitle);
    storesTitle.textContent = 'Disponible en:';
    

    if (storesData && storesData.length > 0) {

        const storesList = document.createElement('ul');
        storesData.forEach(storeObj => {
        const store = storeObj.store; // Accede al objeto 'store' anidado
        const link = document.createElement('a');
        link.href = store.domain.startsWith('http') ? store.domain : `https://${store.domain}`;
        link.textContent = store.name;
        link.target = '_blank'; 
        link.style.display = 'block'; 
        div.appendChild(link);
    });
        div.appendChild(storesList); 
    } else {
        const noStores = document.createElement('p');
        noStores.textContent = 'No se encontraron tiendas para este juego.';
        div.appendChild(noStores);
    }
};

const iteringData = (data) => {
    const body = document.querySelector('body');
    const existingGames = body.querySelectorAll(':scope > div');
    existingGames.forEach(div => {
        if (!div.classList.contains('pagination-container')) {
            if(div.parentNode === body){
                body.removeChild(div);
            }
        }
    });

    let gridContainer = document.querySelector('.games-grid');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.classList.add('games-grid');
        body.appendChild(gridContainer);
    }

    const itemsToShow = data.slice(0, 10);
    itemsToShow.forEach(element => {
        Mostrar(element.name, element.background_image, element.released, element.updated, element.stores);

    });
};



const consulta = async (Api_key, page) => {
    const offset = (page - 1) * pageSize;
    let response = await fetch(`https://api.rawg.io/api/games?key=${Api_key}&page_size=${pageSize}&offset=${offset}&page=66`);
    if (!response.ok){
        throw new Error ("error");
    }
    response = await response.json();
    totalGames = response.count;
    iteringData(response.results);
    renderPagination(); 
};

consulta('a7d86a316bc643c5b658215fb7395c83', 1);


