// Récupération de l'orderId du produit via l'URL
const orderId = new URL(window.location).searchParams.get("order_id");

// Affichage du numéro de la commande
document.getElementById("orderId").innerText = orderId;
