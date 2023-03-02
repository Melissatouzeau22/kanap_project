const items = document.querySelector("#items");

// Récupérer les données avec fetch //
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((product) => {
      // Création d'un élément "a" //
      const anchor = document.createElement("a");
      anchor.href = `./product.html?id=${product._id}`;

      // Affichage de l'élément "article" //
      const article = document.createElement("article");
      anchor.appendChild(article);

      // Affichage des images //
      const image = document.createElement("img");
      image.src = product.imageUrl;
      image.alt = product.altTxt;
      article.appendChild(image);

      // Affichage du H3 //
      const h3 = document.createElement("h3");
      h3.textContent = product.name;
      h3.classList.add("productName");
      article.appendChild(h3);

      // Affichage du P //
      const p = document.createElement("p");
      p.textContent = product.description;
      p.classList.add("productDescription");
      article.appendChild(p);
      items.appendChild(anchor);
    });
  });
