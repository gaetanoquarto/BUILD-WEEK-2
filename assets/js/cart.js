var cart = [];

var cartEmpty = document.getElementById('cartEmpty');
var cartTable = document.getElementById('cart');
var totale = document.getElementById('totale');
var arrayTotale = [];
arrayCarrello = [];
var btnCheckout = document.getElementById('btnCheckout');



window.addEventListener('DOMContentLoaded', init);
function init() {
    getCart();
}


function getCart() {
    let carrello = localStorage.getItem('carrello');
    var ciccio = JSON.parse(carrello);
    totale.innerHTML += '';

    for (let i = 0; i <= carrello.length; i++) {
        var prova = ciccio.products[i];
        console.log(prova);
        cartTable.innerHTML += `<tr><td><img src="${prova.immagineArticolo}" alt="..." class="img-thumbnail w-50"></td><td class="">${prova.nomeArticolo}</td><td class="">€ ${prova.prezzoArticolo}</td></tr>`;
        arrayTotale.push(prova.prezzoArticolo);
        var sum = Math.round(arrayTotale.reduce((partialSum, a) => partialSum + a, 0) * 100) / 100;
        totale.innerHTML = '';
        totale.innerHTML = `TOTALE € ${sum}`;

    }
}

function checkout() {
    if (window.confirm(`Stai per efettuare l\'acquisto. Vuoi confermare?`) == true) {
        window.alert('grazie per l\'acquisto!');
        fetch('http://localhost:3000/carrello')
            .then((response) => {
                return response.json();
            }).then(cart => {
                let user = JSON.parse(localStorage.getItem('user'));
                let idUser = user.id;
                let myCart = cart.find((e) => e.idUtente == idUser);
                let cartId = myCart.id;
                let products = myCart.prodotti;

                deleteCart(cartId);
                localStorage.setItem('carrello', JSON.stringify({}));
                createCart(idUser);
            })

    } else {
        location.href = 'cart.html';
    }
}


async function deleteCart(id) {
    let response = await fetch('http://localhost:3000/carrello/' + id, {
        method: 'DELETE',
    });
}

async function createCart(id) {
    fetch('http://localhost:3000/carrello')
        .then((response) => {
            return response.json();
        }).then(cart => {
            let myCart = cart.find((e) => e.idUtente == id);
            console.log(myCart)
            if (!myCart) {

                fetch('http://localhost:3000/carrello', {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json;charset=utf-8',
                    },
                    body: JSON.stringify({
                        prodotti: [],
                        idUtente: id
                    })
                });
            }
        })
}