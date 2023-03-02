const wrapper = document.getElementById("cart__items");
const cart = getCart();
const products = [];

displayItems();

async function displayItems() {
  for (const product of cart) {
    const article = await makeArticle(product);
    wrapper.appendChild(article);
  }
  setTotalQuantity();
  setTotalPrice();
}

function getCart() {
  let cart = localStorage.getItem("cart");
  if (cart) {
    cart = JSON.parse(cart);
  } else {
    cart = [];
  }
  return cart;
}

// sauvegarde le panier dans le localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function getProduct(id) {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return await response.json();
}

async function makeArticle(element) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = element.id;
  article.dataset.color = element.color;
  const product = await getProduct(element.id);
  products.push(product);
  const image = makeImage(product.imageUrl, product.altTxt);
  article.appendChild(image);

  // creer card_item_content //
  const content = makeCartItemContent(
    product.name,
    product.price,
    element.color,
    element.quantity
  );
  article.appendChild(content);
  return article;
  // cart__item__content__settings//
}
function makeImage(url, alt) {
  const image = document.createElement("img");
  image.src = url;
  image.alt = alt;
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("cart__item__img");
  imageContainer.appendChild(image);
  return imageContainer;
}

function makeCartItemContent(name, price, color, quantity) {
  const cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  const description = makeContentDescription(name, color, price);
  cartItemContent.appendChild(description);

  const settings = makeContentSettings(quantity);
  cartItemContent.appendChild(settings);

  return cartItemContent;
}

function makeContentDescription(name, color, price) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const title = document.createElement("h2");
  title.textContent = name;
  description.appendChild(title);

  const colorElement = document.createElement("p");
  colorElement.textContent = color;
  description.appendChild(colorElement);

  const priceElement = document.createElement("p");
  priceElement.textContent = price + " €";
  description.appendChild(priceElement);
  return description;
}

function makeContentSettings(quantity) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  const settingsQuantity = document.createElement("div");
  settingsQuantity.classList.add("cart__item__content__settings__quantity");
  settings.appendChild(settingsQuantity);

  const settingsDelete = document.createElement("div");
  settingsDelete.classList.add("cart__item__content__settings__delete");
  settings.appendChild(settingsDelete);

  const quantityElement = document.createElement("p");
  quantityElement.textContent = "Qté : ";
  settingsQuantity.appendChild(quantityElement);

  const quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.classList.add("itemQuantity");
  quantityInput.name = "itemQuantity";
  quantityInput.min = 1;
  quantityInput.max = 100;
  quantityInput.value = quantity;
  settingsQuantity.appendChild(quantityInput);

  const deleteElement = document.createElement("p");
  deleteElement.classList.add("deleteItem");
  deleteElement.textContent = "Supprimer";
  deleteElement.addEventListener("click", (e) => deleteElementFromCart(e));
  settingsDelete.appendChild(deleteElement);
  quantityInput.addEventListener("change", (e) => updateElementQuantity(e));
  return settings;
}

//fonction pour additionner les quantity
function setTotalQuantity() {
  // On pointe l'élément //
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

//fonction pour additionner les prix
function setTotalPrice() {
  // On pointe l'élément //
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, cartItem) =>
      total +
      products.find((p) => p._id === cartItem.id).price * cartItem.quantity,
    0
  );
  totalPrice.textContent = total;
}

function updateElementQuantity(e) {
  const article = e.target.closest("article");
  const value = Number(e.target.value);

  //selectionner le bon produit
  const itemToUpdate = cart.find(
    (element) =>
      element.id === article.dataset.id &&
      element.color === article.dataset.color
  );
  //ajout de la quantité
  itemToUpdate.quantity = value;
  //sauvegarde le panier
  saveCart(cart);
  //mettre à jour dans le total
  setTotalQuantity();
  setTotalPrice();
}

function deleteElementFromCart(e) {
  if (!window.confirm("Voulez vous supprimer cet article?")) {
    return;
  }
  const article = e.target.closest("article");

  //selectionner le bon produit
  const itemIndexToDelete = cart.findIndex(
    (element) =>
      element.id === article.dataset.id &&
      element.color === article.dataset.color
  );
  //suppression de l'élement
  cart.splice(itemIndexToDelete, 1);
  article.remove();
  //sauvegarde le panier
  saveCart(cart);
  //mettre à jour dans le total
  setTotalQuantity();
  setTotalPrice();
}

// Formulaire//

//on pointe l'élément//
const orderButton = document.querySelector("#order");
//ajout d'un eventListener au Click//
orderButton.addEventListener("click", (e) => submitForm(e));

function submitForm(e) {
  // Ne pas rafraichir la page
  e.preventDefault();
  // Message d'erreur en cas de panier vide
  if (cart.length === 0) {
    alert("Merci de selectionner un article");
    return;
  }

  //on pointe l'élément
  const form = document.querySelector(".cart__order__form");
  const contact = new FormData(form);

  // Requête Fetch
  fetch("http://localhost:3000/api/products/order", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contact: Object.fromEntries(contact.entries()),
      products: cart.map((e) => e.id),
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      saveCart([]);
      window.location.href = `confirmation.html?order_id=${data.orderId}`;
    });
}

//définition des différentes RegExp
const RegExpList = {
  firstName: new RegExp("^[a-zA-Zéè -]{2,20}$"),
  lastName: new RegExp("^[a-zA-Zéè -]{2,30}$"),
  address: new RegExp("^[a-zA-Zéè 0-9,-]{4,50}$"),
  city: new RegExp("^[a-zA-Zàéè -]{4,30}$"),
  email: new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"),
};

// Test des RegExp en fonction des renseignements utilisateur
function checkUserInformations(input, regex) {
  const id = input.id;
  if (regex.test(input.value)) {
    // bordure verte en cas de données valides
    input.style.border = "2px solid green";
    document.getElementById((`${id}ErrorMsg`.innerText = ""));
  } else {
    // bordure rouge en cas de données invalides
    input.style.border = "2px solid red";
    document.getElementById(`${id}ErrorMsg`).innerText =
      "Le format renseignée n' est pas valide";
    alert("Merci de saisir des données valide");
    return;
  }
}

//Appel de la fonction de validité & stockage input
for (let input of document.querySelector(".cart__order__form")) {
  if (input.type === "text" || input.type === "email") {
    input.addEventListener("change", (e) => {
      checkUserInformations(e.target, RegExpList[e.target.id]);
    });
  }
}
