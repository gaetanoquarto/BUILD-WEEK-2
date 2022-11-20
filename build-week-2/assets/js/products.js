var articoli = [];
var carrello = document.getElementById('carrello');
var cambia;





class Carrello {
    constructor(_idUtente, _articoli = []) {
        this.idUtente = _idUtente;
        this.articoli = _articoli;
    }
}

window.addEventListener('DOMContentLoaded', init);

function init() {
    printData();
}

function printData() {
    fetch('http://localhost:3000/articoli')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            articoli = data;
            if (articoli.length > 0) {
                displayCards.innerHTML = '';
                articoli.map(function (element) {
                    displayCards.innerHTML += `<div class="card m-4" style="width: 18rem;">
                    <img src="${element.immagineArticolo}" class="card-img-top">
                    <div class="card-body">
                    <h5 class="card-title">${element.nomeArticolo}</h5>
                    <h5 class="card-title">€ ${element.prezzoArticolo}</h5>
                    <p class="card-title">${element.categoriaArticolo}</p>
                    <a onClick="updateArticle(${element.id}, '${element.nomeArticolo}', ${element.prezzoArticolo}, '${element.immagineArticolo}')" class="btn btn-warning mb-2 d-block"><i class="bi bi-cart3"></i> Aggiungi al carrello</a>
                    <a onClick="goToSingleProduct(${element.id})" class="btn bg-none text-start p-0 text-dark fs-6 text-decoration-underline">Mostra dettagli</a>
                    </div>
                </div>`;
                });
            } else {
                erroreElenco.innerHTML = 'Nessun elemento presente in elenco.';
            }
        });
}

btnLogoutConfirm.addEventListener('click', function () {
    window.localStorage.clear();
});

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


function goToSingleProduct(y) {
    location.href = 'singleProduct.html?idProd=' + y
}

// Funzione filtra per nome
function searchProduct() {
    const input = document.getElementById('cerca').value.toUpperCase();

    const cardContainer = document.getElementById('displayCards');
    const cards = cardContainer.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let title = cards[i].querySelector(".card-body h5.card-title");
        if (title.innerText.toUpperCase().indexOf(input) > -1) {
            cards[i].style.display = '';
        } else {
            cards[i].style.display = 'none';
        }
    }
}