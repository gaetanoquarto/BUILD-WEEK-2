var articoli = [];
var cartItems = [];
var carrello = document.getElementById('carrello');
var singleProduct = document.getElementById('singleProduct');

window.addEventListener('DOMContentLoaded', init);

function init() {
    const query = window.location.search;
    const urlParams = new URLSearchParams (query);
    const idProdotto = urlParams.get('idProd');
    // controllo se idprodotto è null ecc ecc 
    printData(idProdotto);
}

function printData(i) {
    fetch(`http://localhost:3000/articoli/${i}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let element = data;
            // if (articoli.length > 0) {
            singleProduct.innerHTML = '';
            // articoli.map(function (element) {
            singleProduct.innerHTML += `<div class="col-lg text-center">
                    <img src="${element.immagineArticolo}">
                </div>
                <div class="col-lg my-5 my-lg-0 text-center text-lg-start">
                    <h1 class="mb-3">${element.nomeArticolo}</h1>
                    <p class="bg-danger d-inline py-1 px-2"><i class="bi bi-tag"></i> Top Seller</p> 
                    <p class="mt-3">${element.descrizioneArticolo}</p>
                    <h2 class="mb-4">€ ${element.prezzoArticolo}</h2>
                    <button onclick="updateArticle(${element.id}, '${element.nomeArticolo}', ${element.prezzoArticolo}, '${element.immagineArticolo}')" class="btn btn-yellow" type="button" id="addToCart"><i class="bi bi-cart-fill"></i> Aggiungi al carrello</button>
                </div>`;
                
        });
}


function updateArticle(id, nomeArticolo, prezzoArticolo, immagineArticolo) {
    fetch('http://localhost:3000/carrello')
        .then((response) => {
            return response.json();
        }).then(cart => {
            let user = JSON.parse(localStorage.getItem('user'));
            let idUser = user.id;
            let myCart = cart.find((e) => e.idUtente == idUser);
            let cartId = myCart.id;
            let products = myCart.prodotti;
            if(!products.includes(id)){
                products.push({id, nomeArticolo, prezzoArticolo, immagineArticolo});
            }
            updateCart(myCart, cartId);
            localStorage.setItem('carrello', JSON.stringify({products}));

        })
        
}

async function updateCart(cart, id) {
    let response = await fetch('http://localhost:3000/carrello/' + id, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(cart),
    });
}

var idCarrello = null;

async function addToCart(b) {
    let idCart = localStorage.getItem('carrello');
    let carr = {
        idUtente: localStorage.getItem('idUtente'),
        prodotti: localStorage.getItem('prodottiCarrello')
    }
    console.log(carr);
    carr.prodotti.push(b);

    localStorage.setItem('prodottiCarrello', carr.prodotti);
    await fetch(`http://localhost:3000/carrello/` + idCart, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(carr),
    });

}
