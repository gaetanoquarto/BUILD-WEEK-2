var nomeArticolo = document.getElementById('nome-articolo');
var descrizioneArticolo = document.getElementById('descrizione-articolo');
var immagineArticolo = document.getElementById('immagine-articolo');
var tagliaArticolo = document.getElementById('taglia-articolo');
var categoriaArticolo = document.getElementById('categoria-articolo');
var coloreArticolo = document.getElementById('colore-articolo');
var tipoArticolo = document.getElementById('tipo-articolo');
var tipoAbbigliamento = document.getElementById('tipoAbbigliamento');
var tipoAccessori = document.getElementById('tipoAccessori');
var gustoArticolo = document.getElementById('gusto-articolo');
var prezzoArticolo = document.getElementById('prezzo-articolo');
var btnInserisci = document.getElementById('inserisci-articolo');
var addUserBtn = document.getElementById('addUserBtn');
var btnChiudi = document.getElementById('chiudi-articolo');
var btnChiudiUser = document.getElementById('chiudi-user');
var erroreArticolo = document.getElementById('errore-articolo');
var emailRegister = document.getElementById('emailRegister');
var passwordRegister = document.getElementById('passwordRegister');
var nomeRegister = document.getElementById('nomeRegister');
var cognomeRegister = document.getElementById('cognomeRegister');
var articoli = [];
var utenti = [];
var sovrascrivi;
var sovrascriviUser;
var btnLogout = document.getElementById('btnLogout');



window.addEventListener('DOMContentLoaded', init);

function init() {
    printData();
    eventHandler();

    printUser();
    eventHandlerUser();
}

function eventHandler() {
    btnInserisci.addEventListener('click', function () {
        if (sovrascrivi) {
            overwriteItem(sovrascrivi)
        } else {
            controllaArticolo();
        }
    });
}

function eventHandlerUser() {
    addUserBtn.addEventListener('click', function () {
        if (sovrascriviUser) {
            overwriteUser(sovrascriviUser)
        } else {
            controllaUser();
        }
    });
}

class Articolo {
    constructor(_nomeArticolo, _descrizioneArticolo, _immagineArticolo, _categoriaArticolo, _tagliaArticolo, _coloreArticolo, _tipoArticolo, _gustoArticolo, _prezzoArticolo) {
        this.nomeArticolo = _nomeArticolo;
        this.descrizioneArticolo = _descrizioneArticolo;
        this.immagineArticolo = _immagineArticolo;
        this.categoriaArticolo = _categoriaArticolo;
        this.tagliaArticolo = _tagliaArticolo;
        this.coloreArticolo = _coloreArticolo;
        this.tipoArticolo = _tipoArticolo;
        this.gustoArticolo = _gustoArticolo;
        this.prezzoArticolo = _prezzoArticolo;
    }
}

function printData() {
    fetch('http://localhost:3000/articoli')
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            articoli = data;
            if (articoli.length > 0) {
                corpoTabella.innerHTML = '';
                articoli.map(function (element) {
                    corpoTabella.innerHTML += `<tr>
                        <td class="fw-bold">${element.id}</td>
                        <td><img style="height:80px" src="${element.immagineArticolo}"></td>
                        <td>${element.nomeArticolo}</td>
                        <td>${element.categoriaArticolo}</td>
                        <td>${element.tipoArticolo}</td>
                        <td>${element.coloreArticolo}</td>
                        <td>${element.tagliaArticolo}</td>
                        <td>${element.gustoArticolo}</td>
                        <td>€${element.prezzoArticolo}</td>
                        <td>
                            <button type="button" class="btn btn-outline-danger me-1 mb-1 mb-xxl-0" onclick="deleteItem(${element.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button type="button" data-bs-toggle="modal" data-bs-target="#dashboardAdd" class="btn btn-outline-warning me-1 btnModificaDato" onclick="modifyItem(${element.id})">
                                <i class="bi bi-pencil-square"></i>
                            </button>
                        </td>
                    </tr>`;
                });
            } else {
                erroreElenco.innerHTML = 'Nessun elemento presente in elenco.';
            }
        });
}

function printUser() {
    fetch('http://localhost:3000/utenti')
        .then((response) => {
            return response.json();
        })
        .then((user) => {
            utenti = user;
            if (utenti.length > 0) {
                corpoTabellaUser.innerHTML = '';
                utenti.map(function (element) {
                    corpoTabellaUser.innerHTML += `<tr>
                    <td>${element.id}</td>
                    <td>${element.nomeRegister}</td>
                    <td>${element.cognomeRegister}</td>
                    <td>${element.emailRegister}</td>
                    
                    <td>
                        <button type="button" class="btn btn-outline-danger me-1" onClick="deleteUser(${element.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                        <button type="button" data-bs-toggle="modal" data-bs-target="#addUserModal" class="btn btn-outline-warning me-1 btnModificaDato" onclick="modifyUser(${element.id})">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                    </td>
                </tr>`;
                });
            } else {
                erroreElencoUser.innerHTML = 'Nessun elemento presente in elenco.';
            }
        });
}

function controllaArticolo() {
    if (nomeArticolo.value != '' && descrizioneArticolo.value != '' && categoriaArticolo.value != '' && prezzoArticolo.value != '') {
        var data = {
            nomeArticolo: nomeArticolo.value,
            descrizioneArticolo: descrizioneArticolo.value,
            immagineArticolo: immagineArticolo.value,
            categoriaArticolo: categoriaArticolo.value,
            tagliaArticolo: tagliaArticolo.value,
            coloreArticolo: coloreArticolo.value,
            tipoArticolo: tipoArticolo.value,
            gustoArticolo: gustoArticolo.value,
            prezzoArticolo: prezzoArticolo.value
        };
        addData(data);
    } else {
        erroreArticolo.innerHTML = 'Compila correttamente tutti i campi.';
        return;
    }
}

function controllaUser() {
    if (emailRegister.value != '' && passwordRegister.value != '' && nomeRegister.value != '' && cognomeRegister.value != '') {
        var data = {
            emailRegister: emailRegister.value,
            passwordRegister: passwordRegister.value,
            nomeRegister: nomeRegister.value,
            cognomeRegister: cognomeRegister.value
        };
        addUser(data);
    } else {
        errorRegister.innerHTML = 'Compila correttamente tutti i campi.';
        return;
    }
}

async function addData(data) {
    if (data.immagineArticolo == '') {
        data.immagineArticolo = 'assets/img/logo.png';
    }

    let response = await fetch('http://localhost:3000/articoli', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(data),
    });
}

async function addUser(user) {
    let response = await fetch('http://localhost:3000/utenti', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(user),
    });
    cleanRegister();
}

btnChiudi.addEventListener('click', function () {
    cleanRegister();
});

btnChiudiUser.addEventListener('click', function () {
    cleanRegisterUser();
});

function cleanRegister() {
    nomeArticolo.value = '';
    descrizioneArticolo.value = '';
    immagineArticolo.value = '';
    categoriaArticolo.value = '';
    tagliaArticolo.value = '';
    coloreArticolo.value = '';
    tipoArticolo.value = '';
    gustoArticolo.value = '';
    prezzoArticolo.value = '';
}

function cleanRegisterUser() {
    emailRegister.value = '';
    passwordRegister.value = '';
    nomeRegister.value = '';
    cognomeRegister.value = '';
}

async function deleteItem(i) {
    richiesta = window.confirm('Sei sicuro di voler cancellare?');

    if (richiesta) {
        return await fetch('http://localhost:3000/articoli/' + i, {
            method: 'DELETE'
        });
    }
}

async function deleteUser(i) {
    richiesta = window.confirm('Sei sicuro di voler cancellare?');

    if (richiesta) {
        return await fetch('http://localhost:3000/utenti/' + i, {
            method: 'DELETE'
        });
    }
}

async function modifyItem(i) {
    await fetch(`http://localhost:3000/articoli/${i}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            nomeArticolo.value = data.nomeArticolo;
            descrizioneArticolo.value = data.descrizioneArticolo;
            immagineArticolo.value = data.immagineArticolo;
            categoriaArticolo.value = data.categoriaArticolo;
            tagliaArticolo.value = data.tagliaArticolo;
            coloreArticolo.value = data.coloreArticolo;
            tipoArticolo.value = data.tipoArticolo;
            gustoArticolo.value = data.gustoArticolo;
            prezzoArticolo.value = data.prezzoArticolo;
        });

    return sovrascrivi = i;
}

async function modifyUser(i) {
    await fetch(`http://localhost:3000/utenti/${i}`)
        .then((response) => {
            return response.json();
        })
        .then((user) => {
            nomeRegister.value = user.nomeRegister;
            cognomeRegister.value = user.cognomeRegister;
            emailRegister.value = user.emailRegister;
            passwordRegister.value = user.passwordRegister;
        });

    return sovrascriviUser = i;
}

async function overwriteItem(i) {
    if (nomeArticolo.value && descrizioneArticolo.value && categoriaArticolo.value && prezzoArticolo.value) {
        await fetch(`http://localhost:3000/articoli/${i}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                "nomeArticolo": nomeArticolo.value,
                "descrizioneArticolo": descrizioneArticolo.value,
                "immagineArticolo": immagineArticolo.value,
                "categoriaArticolo": categoriaArticolo.value,
                "tagliaArticolo": tagliaArticolo.value,
                "coloreArticolo": coloreArticolo.value,
                "tipoArticolo": tipoArticolo.value,
                "gustoArticolo": gustoArticolo.value,
                "prezzoArticolo": prezzoArticolo.value,
            }),
        });
        cleanRegister();
    } else {
        erroreArticolo.innerHTML = 'Compila correttamente tutti i campi.';
        return;
    }
}

async function overwriteUser(i) {
    if (nomeRegister.value && cognomeRegister.value && emailRegister.value && passwordRegister.value) {
        await fetch(`http://localhost:3000/utenti/${i}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                "nomeRegister": nomeRegister.value,
                "cognomeRegister": cognomeRegister.value,
                "emailRegister": emailRegister.value,
                "passwordRegister": passwordRegister.value,
            }),
        });
        cleanRegisterUser();
    } else {
        errorRegister.innerHTML = 'Compila correttamente tutti i campi.';
        return;
    }
}

btnLogout.addEventListener('click', function(){
    window.localStorage.clear();
});

var categoria = document.getElementById('categoria-articolo');
categoria.addEventListener('input', function() {
    let elementoSelezionato = categoria.value;
    let gustoArticolo = document.getElementById('gustoArticolo');
    let tipoArticolo = document.getElementById('tipoArticolo');
    let tipoAbbigliamento = document.getElementById('tipoAbbigliamento');
    let tipoAccessori = document.getElementById('tipoAccessori');
    let tagliaArticolo = document.getElementById('tagliaArticolo');
    let coloreArticolo = document.getElementById('coloreArticolo');

    if(elementoSelezionato == 'Abbigliamento') {
        tipoArticolo.style.display = 'block';
        tipoAbbigliamento.style.display = 'block';
        tipoAccessori.style.display = 'none';
        gustoArticolo.style.display = 'none';
        tagliaArticolo.style.display = 'block';
        coloreArticolo.style.display = 'block';
    } else if(elementoSelezionato == 'Accessori') {
        tipoArticolo.style.display = 'block';
        tipoAbbigliamento.style.display = 'none';
        tipoAccessori.style.display = 'block';
        gustoArticolo.style.display = 'none';
        tagliaArticolo.style.display = 'none';
        coloreArticolo.style.display = 'block';
    } else if(elementoSelezionato == 'Alimenti') {
        tipoArticolo.style.display = 'none';
        tipoAbbigliamento.style.display = 'none';
        tipoAccessori.style.display = 'none';
        gustoArticolo.style.display = 'block';
        tagliaArticolo.style.display = 'none';
        coloreArticolo.style.display = 'none';
    } else {
        tipoArticolo.style.display = 'none';
        tipoAbbigliamento.style.display = 'none';
        tipoAccessori.style.display = 'none';
        gustoArticolo.style.display = 'none';
        tagliaArticolo.style.display = 'none';
        coloreArticolo.style.display = 'none';
    }
})