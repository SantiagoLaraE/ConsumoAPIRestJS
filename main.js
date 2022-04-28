const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3&api_key=202375a2-f56a-4091-8c61-edc226939576';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites?api_key=202375a2-f56a-4091-8c61-edc226939576';
const button = document.getElementById('randomCat');
const spanError = document.getElementById('error');
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

async function loadRandomCats(){
    const response = await fetch(API_URL_RANDOM);
    const cats = await response.json();
    const imgHTML1 = document.getElementById('img1');
    const imgHTML2 = document.getElementById('img2');
    const imgHTML3 = document.getElementById('img3');

    console.log(cats)
    if(response.status !== 200){
        spanError.innerHTML = 'Hubo un error: ' + response.status;
    }else{
        imgHTML1.src = cats[0].url;
        imgHTML2.src = cats[1].url;
        imgHTML3.src = cats[2].url; 
    }
}

loadRandomCats()
button.onclick = () => loadRandomCats();


async function getFavoritesCats(){
    const response = await fetch(API_URL_FAVORITES);
    const data = await response.json();

    if(response.status !== 200){
        spanError.innerHTML = `Hubo un error: ${data.status}.`;
    }else{
        console.log(data)
    }

}
getFavoritesCats();

async function saveFavoriteCat(){
    const res = await fetch(API_URL_FAVORITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'image_id': '7ce'
        })
    })
    const data = res.json();

    if (res.status !== 200) {
        spanError.innerHTML = `Lo siento hubo un error: ${res.status} ${data.message}`;
    }else{
        console.log(res);
    }
}