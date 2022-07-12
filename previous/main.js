const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1',
});

api.defaults.headers.common['X-API-KEY'] = '202375a2-f56a-4091-8c61-edc226939576';

const API_URL_RANDOM =
  "https://api.thecatapi.com/v1/images/search?limit=3";
const API_URL_FAVORITES =
"https://api.thecatapi.com/v1/favourites";
const API_URL_FAVORITES_DELETE = (id) =>
`https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_IMG_UPLOAD = "https://api.thecatapi.com/v1/images/upload";
const spanError = document.getElementById("error");

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

async function loadRandomCats() {
  const response = await fetch(API_URL_RANDOM);
  const cats = await response.json();

  const section = document.getElementById("randomCats");

  const sectionTitle = `<div class="randomCats__title">
    <h2>Gatos Aleatorios</h2>
    <button id="loadRandomCats" class="btn-primary">Recargar</button>
  </div>`;

  section.innerHTML = sectionTitle;

  const btnReload = document.getElementById("loadRandomCats");
  btnReload.onclick = () => loadRandomCats();

  if (response.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + response.status;
  } else {
    

    const sectionContainer = document.createElement("section");
    sectionContainer.classList.add("section__container");

    cats.forEach((cat) => {
      const article = document.createElement("article");

      const img = document.createElement("img");
      img.src = cat.url;

      const btn = document.createElement("button");
      const btnText = document.createTextNode("Agregar a favoritos");
      btn.classList.add("btn-primary");
      btn.appendChild(btnText);

      btn.onclick = () => saveFavoriteCat(cat.id);

      article.appendChild(img);
      article.appendChild(btn);

      sectionContainer.appendChild(article);
    });

    section.appendChild(sectionContainer);
  }
}

loadRandomCats();

async function loadFavoritesCats() {
  const response = await fetch(API_URL_FAVORITES, {
    method: 'GET',
    headers: {
      'x-api-key': '202375a2-f56a-4091-8c61-edc226939576',
    }
  });
  const data = await response.json();

  if (response.status !== 200) {
    spanError.innerHTML = `Hubo un error: ${data.status}.`;
  } else {
    const section = document.getElementById("favoritesCats");
    section.innerHTML = "";

    const titleSection = document.createElement("h2");
    const titleSectionText = document.createTextNode("Gatos Favoritos");
    titleSection.appendChild(titleSectionText);
    section.appendChild(titleSection);

    const sectionContainer = document.createElement("div");
    sectionContainer.classList.add("section__container");

    data.forEach((cat) => {
      const article = document.createElement("article");

      const img = document.createElement("img");

      const btn = document.createElement("button");
      btn.classList.add("btn-primary");

      const btnText = document.createTextNode("Sacar de favoritos");
      btn.appendChild(btnText);

      btn.onclick = () => deleteFavoriteCat(cat.id);

      img.src = cat.image.url;

      article.appendChild(img);
      article.appendChild(btn);

      sectionContainer.appendChild(article);
    });
    section.appendChild(sectionContainer);
  }
}

loadFavoritesCats();

async function saveFavoriteCat(id) {
  const {data, status} = await api.post('/favourites', {
    image_id: id,
  });

  /*
  const res = await fetch(API_URL_FAVORITES, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'x-api-key': '202375a2-f56a-4091-8c61-edc226939576',
    },
    body: JSON.stringify({
      image_id: id,
    }),
  });
  const data = await res.json();
  */
  console.log(data, status)
  if (status !== 200) {
    spanError.innerHTML = `Lo siento hubo un error: ${status} ${data.message}`;
  } else {
    loadFavoritesCats();
  }
}

async function deleteFavoriteCat(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: "DELETE",
    headers: {
      'x-api-key': '202375a2-f56a-4091-8c61-edc226939576',
    }
  });

  const data = res.json();

  if (res.status !== 200) {
    spanError.innerHTML = `Lo siento hubo un error: ${res.status} ${data.message}`;
  } else {
    loadFavoritesCats();
  }
}
async function uploadCatPhoto(){
  const form = document.getElementById('uploadingFormCat');
  
  const formData = new FormData(form);

  const res = await fetch(API_URL_IMG_UPLOAD, {
    method: 'POST',
    headers: {
      'x-api-key': '202375a2-f56a-4091-8c61-edc226939576',
    },
    body: formData,
  });

  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = `Hubo un error: ${res.status} ${data.message}.`;
  } else {
    console.log('Imagen subida!');
    console.log(data);
    console.log(data.url);
    saveFavoriteCat(data.id);
  }

}

function loadThumbnail(n){
  const form = document.getElementById('uploadingFormCat');
  if(n[0] === undefined){
    form.childNodes[0].src = "";
  }else{
    if(form.childNodes[0].tagName === 'IMG'){
      form.childNodes[0].src = URL.createObjectURL(n[0])
    }else{
      const img = document.createElement('img');
      img.src = URL.createObjectURL(n[0])
      img.classList.add('thumbnail');
      form.prepend(img);
    }
  }
}