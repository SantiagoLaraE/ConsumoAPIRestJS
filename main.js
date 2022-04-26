const URL = 'https://api.thecatapi.com/v1/images/search?limit=3'
const button = document.querySelector('button');
/*
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
*/

// ASYNC - AWAIT

async function reloadCat(){
    const response = await fetch(URL);
    const cats = await response.json();

    const imgHTML1 = document.getElementById('img1');
    const imgHTML2 = document.getElementById('img2');
    const imgHTML3 = document.getElementById('img3');

    imgHTML1.src = cats[0].url;
    imgHTML2.src = cats[1].url;
    imgHTML3.src = cats[2].url;
}

reloadCat()

button.onclick = () => {reloadCat()};
