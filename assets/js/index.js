//---input fields login/register---//

var emailLogin = document.getElementById('emailLogin');
var passwordLogin = document.getElementById('passwordLogin');

var emailRegister = document.getElementById('emailRegister');
var passwordRegister = document.getElementById('passwordRegister');
var nomeRegister = document.getElementById('nomeRegister');
var cognomeRegister = document.getElementById('cognomeRegister');

var loginBtn = document.getElementById('loginBtn');
var registerBtn = document.getElementById('registerBtn');
var addUserBtn = document.getElementById('addUserBtn');

var errorLogin = document.getElementById('errorLogin');
var errorRegister = document.getElementById('errorRegister');

var userText = document.getElementById('userText');

var btnLogoutConfirm = document.getElementById('btnLogoutConfirm');
var btnLogout = document.getElementById('btnLogout');
var btnCart = document.getElementById('btnCart');
var user = localStorage.getItem('user');
var btnLogin = document.getElementById('btnLogin');

var mailCorrect = document.getElementById('emailCorrect');
var pwCorrect = document.getElementById('pwCorrect');
var mailIncorrect = document.getElementById('emailIncorrect');
var pwIncorrect = document.getElementById('pwIncorrect');

var mailLoginIncorrect = document.getElementById('emailLoginIncorrect');

var regexMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var regexPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

var utenti = [];

var loginUtente;
var saluto;

class Utente {
    constructor(_emailRegister, _passwordRegister, _nomeRegister, _cognomeRegister) {
        this.emailRegister = _emailRegister;
        this.passwordRegister = _passwordRegister;
        this.nomeRegister = _nomeRegister;
        this.cognomeRegister = _cognomeRegister;
    }
}

//-----------------------------------------------------------------------------START HERE

window.addEventListener('DOMContentLoaded', init);

function init() {
    checkLocalStorage();
    errorRegister.innerHTML = '';
    errorLogin.innerHTML = '';
}

//funzione per scrivere dentro json ---> REGISTER
registerBtn.addEventListener('click', function () {
    controllaRegister();
});

function controllaRegister() {
    if (emailRegister.value != '' && passwordRegister.value != '' && nomeRegister.value != '' && cognomeRegister.value != '' && emailRegister.value.match(regexMail) && passwordRegister.value.match(regexPw)) {
        pwIncorrect.style.display = 'none';
        mailIncorrect.style.display = 'none';
        mailCorrect.innerHTML = 'Email valida';
        pwCorrect.innerHTML = 'Password valida';
        errorRegister.style.display = 'none';
        var data = {
            emailRegister: emailRegister.value,
            passwordRegister: passwordRegister.value,
            nomeRegister: nomeRegister.value,
            cognomeRegister: cognomeRegister.value
        };
        addData(data);
    } else {
        pwCorrect.style.display = 'block';
        mailCorrect.style.display = 'block';
        errorRegister.style.display = 'block';
        pwIncorrect.innerHTML = 'Password non valida! Deve contenere almeno 8 caratteri e 1 numero.';
        mailIncorrect.innerHTML = 'Email non valida';
        errorRegister.innerHTML = 'Compila correttamente tutti i campi.';
        return;
    }
}

async function addData(data) {
    let response = await fetch('http://localhost:3000/utenti', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    cleanRegister();
}

function controllaLogin() {
    loginUtente = new Utente(emailLogin.value, passwordLogin.value);

    fetch('http://localhost:3000/utenti').then((response) => {
        return response.json();
    }).then((data) => {
        utenti = data;
        utenti.map(async function (element) {
            if (loginUtente.emailRegister === element.emailRegister && loginUtente.passwordRegister === element.passwordRegister && element.emailRegister.match(regexMail)) {
                // await getCartFromUser(element.id);
                // localStorage.setItem('idUtente', element.id);
                if (element.emailRegister === 'admin@admin.com') {
                    location.href = 'dashboard.html';
                    localStorage.setItem('user', JSON.stringify({ id: element.id, email: element.emailRegister, nome: element.nomeRegister, cognome: element.cognomeRegister, admin: true }));
                    localStorage.getItem('carrello', JSON.stringify({}));
                } else {
                    localStorage.setItem('user', JSON.stringify({ id: element.id, email: element.emailRegister, nome: element.nomeRegister, cognome: element.cognomeRegister, admin: false }));
                    localStorage.setItem('carrello', JSON.stringify({}));
                    await createCart(element.id, 'index.html')
                }
                mailLoginIncorrect.style.display = 'none';
                errorLogin.style.display = 'none';
            } else {
                mailLoginIncorrect.style.display = 'block';
                errorLogin.style.display = 'block';
                mailLoginIncorrect.innerHTML = 'Email non valida!'
                errorLogin.innerHTML = 'Form non valido';
                return;
            }
        })
    })
}
async function createCart(id, path) {
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
            } else {
                location.href = path;
            }
        })
}

// ?emailRegister=' + loginUtente.emailRegister

function cleanRegister() {
    emailRegister.value = '';
    passwordRegister.value = '';
    nomeRegister.value = '';
    cognomeRegister.value = '';
}

//funzione per prendere i dati dal json ---> LOGIN

loginBtn.addEventListener('click', function () {
    controllaLogin();
    cleanLogin();
});

function cleanLogin() {
    emailLogin.value = '';
    passwordLogin.value = '';
    nomeRegister.value = '';
    cognomeRegister.value = '';
}

btnLogoutConfirm.addEventListener('click', function () {
    window.localStorage.clear();
});


function checkLocalStorage() {
    if (user) {
        btnLogout.style.display = 'block';
        btnCart.style.display = 'block';
        btnLogin.style.display = 'none';
    } else {
        btnLogout.style.display = 'none';
        btnCart.style.display = 'none';
        btnLogin.style.display = 'block';
    }
}

async function getCartFromUser(idUser) {
    console.log(idUser);
    await fetch('http://localhost:3000/carrello?idUtente=' + idUser)
        .then(res => res.json())
        .then((res) => {
            localStorage.setItem('idCarrello', res[0].id)
            localStorage.setItem('prodottiCarrello', res[0].prodotti)
        })

}