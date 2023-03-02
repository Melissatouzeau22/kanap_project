// Récupérer l'id du produit via l'URL //
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");

// Récupérer le produit dans l'api & traiter les données //
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((res) => handleData(res));

function handleData(kanap) {
  const colors = kanap.colors;
  const description = kanap.description;
  const imageUrl = kanap.imageUrl;
  const name = kanap.name;
  const price = kanap.price;
  makeImage(imageUrl, kanap.altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescrition(description);
  makeColors(colors);
}

// Affichage de l'image //
function makeImage(imageURL, altTxt) {
  const image = document.createElement("img");
  image.src = imageURL;
  image.alt = altTxt;
  document.querySelector(".item__img").appendChild(image);
}

// Affichage du titre //
function makeTitle(name) {
  const h1 = document.querySelector("#title");
  if (h1 != null) h1.textContent = name;
}

// Affichage du prix//
function makePrice(price) {
  const priceElement = document.querySelector("#price");
  if (priceElement != null) priceElement.textContent = price;
}

// Affichage de la description//
function makeDescrition(description) {
  const descriptionElement = document.querySelector("#description");
  if (descriptionElement != null) descriptionElement.textContent = description;
}

// Affichage des couleurs//
function makeColors(colors) {
  const select = document.querySelector("#colors");
  if (select != null) {
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
}

// Affichage dans le panier//
const button = document.querySelector("#addToCart");
if (button != null) {
  button.addEventListener("click", (e) => {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;

    // Message d'alerte en cas de couleur & quantité vide pour l'ajout au panier
    if (color == null || color === "" || quantity == null || quantity == 0) {
      alert("Veuillez saisir une quantité et une couleur");
      return;
    }
    // Message d'alerte en cas de quantité non comprise entre 0 & 100
    if (quantity < 1 || quantity > 100) {
      alert("veuillez saisir une quantité entre 1 et 100");
      return;
    }

    // Stockage des datas dans le local stockage//
    const data = {
      id: id,
      color: color,
      quantity: Number(quantity),
    };

    // appel de la fonction qui ajout l'objet au tableau dans le local storage //
    addToCart(data);

    // Redirection vers le panier//
    window.location.href = "cart.html";
  });
}

function addToCart(data) {
  let cart = localStorage.getItem("cart");
  if (cart) {
    cart = JSON.parse(cart);
  } else {
    cart = [];
  }

  // Permet de trouver dans le panier actuel si le produit est déjà dedans à l'aide de son id & de sa couleur //
  const cartItem = cart.find(
    (item) => item.id === data.id && item.color === data.color
  );
  if (cartItem) {
    cartItem.quantity += data.quantity;
    // message qui indique au client que le produit a été ajouté au panier //
    alert("Votre article à été ajouté au panier");
  } else {
    // on pousse le produit dans le panier//
    cart.push(data);
    // on sauvegarde le panier dans le local storage //

    // message qui indique au client que le produit a été ajouté au panier //
    alert("Votre acticle à été ajouté au panier");
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}
