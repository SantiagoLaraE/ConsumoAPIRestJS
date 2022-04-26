const URL = 'https://api.thecatapi.com/v1/images/search'
const imgHTML = document.querySelector('img');
const button = document.querySelector('button');

// PROMESAS

function renderCat(){
    fetch(URL)
    .then(response => response.json())
    .then(data => {
        const img = document.querySelector('img');
        img.src = data[0].url;
    });
}

renderCat();

button.onclick = () => {renderCat()};


// ASYNC - AWAIT

async function getData(){
    const response = await fetch(URL);
    const data = await response.json();
    return data;
}

async function renderCat(){
    const img = await getData();
    imgHTML.src = img[0].url;
}

renderCat()

button.onclick = () => {renderCat()};
