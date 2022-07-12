const API = "https://api.thecatapi.com/v1";
const xapikey = "26da9bbc-4646-4154-88ca-c25f83d5e7a5";

async function renderRandomCats(API_URL) {
  const randomCatsContainer = document.querySelector(".cats__container");
  try {
    randomCatsContainer.innerHTML = "";
    const response = await fetch(`${API_URL}/images/search?limit=9`);
    const data = await response.json();

    const fragment = new DocumentFragment();
    data.forEach((cat) => {
      const figure = document.createElement("figure");
      figure.classList.add("cat");

      const catImg = document.createElement("img");
      catImg.setAttribute("src", cat.url);
      catImg.classList.add("cat-img");

      const btn = document.createElement("button");
      btn.classList.add("favorite-btn");

      btn.addEventListener("click", function () {
        addCatToFavorites(cat.id);
      });

      const btnImg = document.createElement("img");
      btnImg.setAttribute("src", "./img/favorite.svg");
      btnImg.setAttribute("alt", "heart favorite icon");

      btn.appendChild(btnImg);

      figure.appendChild(catImg);
      figure.appendChild(btn);

      fragment.appendChild(figure);
    });
    randomCatsContainer.appendChild(fragment);
  } catch (error) {
    randomCatsContainer.innerHTML = error;
  }
}

renderRandomCats(API);

const moreCatsBtn = document.querySelector("#more-cats-btn");

moreCatsBtn.addEventListener("click", () => {
  renderRandomCats(API);
});

async function addCatToFavorites(id) {
  try {
    const imageID = { image_id: id };
    const response = await fetch(`${API}/favourites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xapikey,
      },
      body: JSON.stringify(imageID),
    });
    const data = await response.json();
    showNotification("Your cat has been saved in favorites", "info");
    getFavoritesCats();
  } catch (error) {
    console.log(error);
  }
}

async function removeCatFromFavorites(id) {
  try {
    const response = await fetch(`${API}/favourites/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xapikey,
      },
    });
    const data = await response.json();
    showNotification("Your cat has been deleted", "danger");
    getFavoritesCats();
  } catch (error) {
    console.log(error);
  }
}

async function getFavoritesCats() {
  try {
    const response = await fetch(`${API}/favourites`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": xapikey,
      },
    });
    const data = await response.json();

    const modalBody = document.querySelector(".modal-body");
    const modalTitle = document.querySelector(".modal-header__title");
    modalTitle.innerHTML = "Your favorite cats";
    const container = document.createElement("div");
    container.classList.add("cats__container");
    const fragment = new DocumentFragment();
    data.forEach((cat) => {
      const figure = document.createElement("figure");
      figure.classList.add("cat");

      const catImg = document.createElement("img");
      catImg.setAttribute("src", cat.image.url);
      catImg.classList.add("cat-img");

      const btn = document.createElement("button");
      btn.classList.add("delete-btn");

      btn.addEventListener("click", function () {
        removeCatFromFavorites(cat.id);
      });

      const btnImg = document.createElement("img");
      btnImg.setAttribute("src", "./img/trash.svg");
      btnImg.setAttribute("alt", "trash icon");

      btn.appendChild(btnImg);

      figure.appendChild(catImg);
      figure.appendChild(btn);

      fragment.appendChild(figure);
    });
    container.appendChild(fragment);
    modalBody.innerHTML = "";
    modalBody.appendChild(container);
  } catch (error) {
    console.log(error);
  }
}

const favoriteCatsLink = document.querySelector("#favorite-cats-link");
favoriteCatsLink.addEventListener("click", function (e) {
  e.preventDefault();
  getFavoritesCats();
  showModal();
});

function showNotification(text, type = "info") {
  const notification = document.querySelector(".notification");
  const notificationContent = document.querySelector(".notification-content");

  notification.classList.add("opened");
  notificationContent.innerHTML = text;
  notificationContent.classList.add(type);

  setTimeout(function () {
    notification.classList.remove("opened");
    notificationContent.classList.remove(type);
  }, 4000);
}

const uploadImageLink = document.querySelector("#upload-image-link");
uploadImageLink.addEventListener("click", function (e) {
  e.preventDefault();
  renderUploadForm();
  showModal();
});

function renderUploadForm() {
  const modalBody = document.querySelector(".modal-body");
  const modalTitle = document.querySelector(".modal-header__title");
  modalTitle.innerHTML = "Upload your image";
  modalBody.innerHTML = "";
  modalBody.innerHTML = `
  <form action="" id="uploadIMG" class="upload-img" method="post">
              <div class="col-1">
                <input type="file" name="file" id="file" accept="image/*" required>
              <label for="file">
                <span>+</span>
                <p>Choose a image</p>
              </label>
              <button type="button" class="btn-primary" id="upload-image">Upload Image</button>
              </div>
              <div class="col-2"> No image selected</div>
            </form>
  `;

  const formInput = document.querySelector("#uploadIMG #file");
  const formCol = document.querySelector("#uploadIMG .col-2");
  formInput.addEventListener("change", function () {
    if (this.files[0] === undefined) {
      formCol.innerHTML = "No image selected";
      formInput.src = "";
    } else {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(this.files[0]);
      formCol.innerHTML = "";
      formCol.appendChild(img);
    }
  });

  const btnUploadImage = document.getElementById("upload-image");
  btnUploadImage.addEventListener("click", function () {
    uploadCatImage();
  });
}

async function uploadCatImage() {
  const form = document.querySelector("#uploadIMG");
  const formData = new FormData(form);

  if (formData.get("file").name == "") {
    showNotification("You did not select any image", "danger");
  } else {
    showNotification("Uploading ...");
    const response = await fetch(`${API}/images/upload`, {
      method: "POST",
      headers: {
        "x-api-key": xapikey,
      },
      body: formData,
    });

    console.log(response);
    const data = await response.json();
    addCatToFavorites(data.id);
  }
}

function showModal() {
  const modal = document.querySelector(".modal");
  const html = document.querySelector("html");
  modal.classList.add("opened");
  html.classList.add("no-scroll");
}

function closeModal() {
  const modal = document.querySelector(".modal");
  const html = document.querySelector("html");
  const modalBody = document.querySelector(".modal-body");
  const modalTitle = document.querySelector(".modal-header__title");
  modalTitle.innerHTML = "";
  modalBody.innerHTML = "";
  modal.classList.remove("opened");
  html.classList.remove("no-scroll");
}

const modalCloser = document.querySelector(".modal-closer");
modalCloser.addEventListener("click", function (e) {
  e.preventDefault();
  closeModal();
});

const mobileNavBtn = document.querySelector(".mobile-nav");
const navMobile = document.querySelector(".navbar .nav");

mobileNavBtn.addEventListener("click", () => {
  if (mobileNavBtn.classList.contains("active")) {
    hideMobileNav();
  } else {
    showMobileNav()
  }
});

function hideMobileNav() {
  mobileNavBtn.classList.remove("active");
  navMobile.classList.remove("active");
}
function showMobileNav() {
  mobileNavBtn.classList.add("active");
  navMobile.classList.add("active");
}

const navLinks = document.querySelectorAll('.nav .nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    hideMobileNav()
  })
});