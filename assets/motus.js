import { dictionary_list } from './words.js';

//#region DataStructures

/**
 * LocalStorage history structure
 * @typedef {Object} gameHistory
 * @property {string} randomWord - Mot à deviner
 * @property {int} nTry - Nombre d'essais
 * @property {string} guessedWord - Mot donné par l'utilisateur
 * @property {boolean} win - Si le joueur a gagné ou non
 */

//#endregion


//#region Global variables

let Nguess;
let randomWord;
let guessedWord = new Map();
let currentFocusedCell;

//#endregion


//#region Game functions

/**
 * Génère le mot, le tableau et l'historique
 */
function startGame() {
    console.log(localStorage)
    Nguess = 0;
    //localStorage.clear();
    generateRandomWord();
    generateGameTable();
    generateHistoryTable();
}

/**
 * Génère un mot aléatoire, en le prenant dans le dictionnaire
 */
function generateRandomWord() {
    let randomDictionnary = dictionary_list[Math.floor(Math.random() * 5)];
    randomWord = randomDictionnary[Math.floor(Math.random() * randomDictionnary.length)];
    while (!randomWord) {
        randomWord = randomDictionary[Math.floor(Math.random() * randomDictionary.length)];
    }
    guessedWord.set(0, true);
    for (let i = 1; i < randomWord.length; i++) {
        guessedWord.set(i, false);
    }
}

/**
 * Génère le tableau de jeu
 */
function generateGameTable() {
    let table = document.getElementById("motus");
    let tHead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("colspan", randomWord.length);
    th.innerHTML = "MOTUS";
    tr.appendChild(th);
    tHead.appendChild(tr);

    let tBody = document.createElement("tbody");
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        row.setAttribute("id", ("line" + i));
        row.setAttribute("class", ("motus"));

        generateGameCells(row, i);
        tBody.appendChild(row);
    }
    tHead.appendChild(tBody);
    table.appendChild(tHead);
    currentFocusedCell = 1;
    setFocusedCellBG();
    console.log(randomWord)
}

/**
 * Génère les cases de la ligne du tableau de jeu
 * @param {row} row Ligne du tableau de jeu
 * @param {int} i Numéro de la ligne
 */
function generateGameCells(row, i) {
    for (let j = 0; j < randomWord.length + 1; j++) {
        const col = document.createElement('td');
        col.setAttribute("border", "20");
        col.setAttribute("id", `cell${i + "-" + j}`);
        col.setAttribute("class", "motus");
        if (i == 0) {
            if (j == 0) {
                col.innerHTML = randomWord[0];
                col.setAttribute("class", 'right');
            } else if (j == randomWord.length) {
                const confirmButton = document.createElement('button');
                confirmButton.setAttribute("type", "submit");
                confirmButton.setAttribute("class", "btn btn-motus");
                confirmButton.setAttribute("onclick", "guess()");
                col.setAttribute("class", 'send');
                col.appendChild(confirmButton);
            } else {
                col.setAttribute("class", 'guessing');
            }
        } else if (j == randomWord.length) {
            col.setAttribute("class", 'send');
        }
        row.appendChild(col);
    }
}

/**
 * Teste si les cases sont vides, et si non, vérifie le mot donné par l'utilisateur
 */

function guess() {
    if (areEmptyFields()) {
        alert('Remplissez tous les champs');
    } else {
        const word = getUserWord();

        if (dictionary_list[randomWord.length-5].includes(word)) {
            document.getElementById(`cell${Nguess + "-" + randomWord.length}`).innerHTML = "";
            if (word == randomWord) {
                endGame(word, true);
            } else if (Nguess == 5) {
                endGame(word, false);
            } else {
                Nguess++;
                generateNextLine(word);
            }
        } else {
            alert("Le mot n'est pas dans le dictionnaire");
        }
    }
}

/**
 * 
 * @returns {boolean} true si tous les champs sont vides, false sinon 
 */
function areEmptyFields() {
    let empty = false
    for (let [key, value] of guessedWord) {
        if (!value && document.getElementById(`cell${Nguess + "-" + key}`).innerHTML == "") {
            empty = true;
        }
    }
    return empty
}

/**
 * Récupère le mot donné par l'utilisateur
 */
function getUserWord() {
    let word = "";
    for (let [key, value] of guessedWord) {
        if (value) {
            word += randomWord[key];
        } else {
            word += document.getElementById(`cell${Nguess + "-" + key}`).innerHTML;
        }
    }
    return word;
}

/**
 * Génère la ligne suivante du tableau de jeu
 * @param {string} word Mot saisi par l'utilisateur
 */
function generateNextLine(word) {
    for (let [key, value] of guessedWord) {
        const nextcell = document.getElementById(`cell${Nguess + "-" + key}`);
        const cell = document.getElementById(`cell${Nguess - 1 + "-" + key}`);
        if (value || word[key] == randomWord[key]) {
            cell.setAttribute('class', 'right');
            cell.innerHTML = randomWord[key];
            nextcell.setAttribute('class', 'right');
            nextcell.innerHTML = randomWord[key];
            guessedWord.set(key, true);
        } else if (randomWord.includes(word[key])) {
            cell.setAttribute('class', 'wrongPlace');
            cell.innerHTML = word[key];
            nextcell.setAttribute('class', 'guessing');
        } else {
            cell.setAttribute('class', 'false');
            cell.innerHTML = word[key];
            nextcell.setAttribute('class', 'guessing');
        }
    }
    for (let [key, value] of guessedWord) {
        if (!value) {
            currentFocusedCell = key;
            break;
        }
    }
    const confirm = document.getElementById(`cell${Nguess + "-" + randomWord.length}`);
    const confirmButton = document.createElement('button');
    confirmButton.setAttribute("type", "submit");
    confirmButton.setAttribute("class", "btn btn-motus");
    confirmButton.addEventListener('click', guess);
    confirm.setAttribute("class", 'send');
    confirm.appendChild(confirmButton);
}

/**
 * Enregistre la partie dans l'historique, et demande à l'utilisateur s'il veut rejouer
 * @param {string} word Mot saisi par l'utilisateur
 * @param {boolean} win true si le mot est le bon, false sinon
 */
function endGame(word, win) {
    if (win) {
        // for (let i = 0; i < randomWord.length; i++) {
        //     const cell = document.getElementById(`cell${Nguess + "-" + i}`);
        //     cell.setAttribute('class', 'won');
        //     cell.innerHTML = randomWord[i];
        // }
        setHistory(word, true);
    } else {
        // for (let [key, value] of guessedWord) {
        //     const cell = document.getElementById(`cell${Nguess + "-" + key}`);
        //     if (value) {
        //         cell.setAttribute('class', 'right');
        //     } else {
        //         cell.setAttribute('class', 'false');
        //     }
        //     cell.innerHTML = randomWord[key];
        // }
        setHistory(word, false);
    }
    askForNewGame();
}

/**
 * Demande à l'utilisateur s'il veut rejouer, et régénère un plateau si oui, sinon crée un bouton replay
 */
function askForNewGame() {
    if (confirm('Voulez-vous rejouer ?')) {
        document.getElementById('motus').innerHTML = "";
        startGame();
    } else {
        document.getElementById('motus').innerHTML = "";
        const replay = document.createElement('button');
        replay.setAttribute("type", "submit");
        replay.setAttribute("class", "replay");
        replay.addEventListener('click', startGame);
        document.getElementById('motus').appendChild(replay);
    }
}

//#endregion


//#region Ergonomic

/**
 * Change la couleur de la cellule sur laquelle le curseur est
 * @param {int} oldCell Ancienne cellule sur laquelle le curseur était
 */
function setFocusedCellBG(oldFocusedCell) {
    const currentCell = document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`);
    currentCell.setAttribute('class', 'focusedGuessCell');
    if(oldFocusedCell != null){
        const oldCell = document.getElementById(`cell${Nguess + "-" + oldFocusedCell}`);
        oldCell.setAttribute('class', 'guessing');
    }
}

/**
 * Déplace le curseur sur la case cliquée
 */
function focusCell(e) {
    if (e.target.tagName.toLowerCase() === 'td' && e.target.getAttribute("class") == "guessing") {
        const oldFocusedCell = currentFocusedCell;
        currentFocusedCell = parseInt(e.target.id.split("-")[1]);
        setFocusedCellBG(oldFocusedCell);
    }
}

/**
 * Determine le comportement du curseur/de l'application en fonction de la touche pressée
 * @param {event} e L'évènement de la touche appuyée
 */
function getKeyboardEntries(e) {
    if (e.key == "Enter" && Nguess < 6) {
        guess();
    } else if (e.key == "Backspace") {
        cursorDelete();
    } else if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]$/u.test(e.key)) {
        cursorAdd(e)
    }
}

/**
 * Supprime une lettre et recule le curseur
 */
function cursorDelete() {
    if (currentFocusedCell > 0 && currentFocusedCell <= randomWord.length) {
        if (document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML == "" && currentFocusedCell > 1) {
            findPreviousFreeCell();
            document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = "";
        } else if (document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML != "" && currentFocusedCell > 1) {
            document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = "";
            findPreviousFreeCell();
        }
        else if (currentFocusedCell == randomWord.length - 1 || currentFocusedCell == 1) {
            document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = "";
        }
    }
}

/**
 * Cherche la précédente cellule libre, et la met en focus si elle existe
 */
function findPreviousFreeCell() {
    const oldFocusedCell = currentFocusedCell;
    for (let i = currentFocusedCell - 1; i > 0; i--) {
        if (document.getElementById(`cell${Nguess + "-" + i}`).getAttribute("class") != "right") {
            currentFocusedCell = i;
            setFocusedCellBG(oldFocusedCell);
            break;
        }
    }
}

/**
 * Déplace le curseur vers la case suivante si la touche appuyée est une lettre
 * @param {event} e L'évènement de la touche appuyée
 */
function cursorAdd(e) {
    const oldFocusedCell = currentFocusedCell;
    if (currentFocusedCell > 0 && currentFocusedCell < randomWord.length) {
        let value = e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = value.toUpperCase();
        for (let i = currentFocusedCell + 1; i < randomWord.length; i++) {
            if (document.getElementById(`cell${Nguess + "-" + i}`).getAttribute("class") != "right") {
                currentFocusedCell = i;
                setFocusedCellBG(oldFocusedCell);
                break;
            }
        }
    }
}

//#endregion


//#region Historique

/**
 * Génère le tableau d'historique, en récupérant les données dans le localStorage
 */
function generateHistoryTable() {
    let table = document.getElementById("historique");
    table.innerHTML = "";

    let tHead = document.createElement("thead");
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.setAttribute("colspan", 4);
    th.innerHTML = "Historique des parties";
    tr.appendChild(th);
    tHead.appendChild(tr);

    let tBody = document.createElement("tbody");
    generateHistoryHead(tBody);
    for (let i = 1; i < 10; i++) {
        if (localStorage.getItem(i) != null) {
            const row = document.createElement('tr');
            row.setAttribute("id", ("game" + i));
            const history = JSON.parse(localStorage.getItem(i));
            generateHistoryRow(row, history);
            tBody.appendChild(row);
        } else {
            continue;
        }
    }
    tHead.appendChild(tBody);
    table.appendChild(tHead);
}

/**
 * Génère la ligne d'entête du tableau d'historique
 * @param {tBody} tBody Corps du tableau à générer
 */
function generateHistoryHead(tBody) {
    const row = document.createElement('tr');
    const col1 = document.createElement('th');
    col1.innerHTML = "Mot à deviner";
    row.appendChild(col1);

    const col2 = document.createElement('th');
    col2.innerHTML = "Nombre d'essais";
    row.appendChild(col2);

    const col3 = document.createElement('th');
    col3.innerHTML = "Mot deviné";
    row.appendChild(col3);

    const col4 = document.createElement('th');
    col4.innerHTML = "Résultat";
    row.appendChild(col4);
    row.setAttribute("class", "historyHead")
    tBody.appendChild(row);
}

/**
 * 
 * @param {HTMLTableRowElement} row Ligne à générer
 * @param {gameHistory} history Historique récupéré du localStorage
 */
function generateHistoryRow(row, history) {
    const col1 = document.createElement('td');
    col1.setAttribute("class", "wordToGuess")
    col1.innerHTML = history.wordToGuess;
    row.appendChild(col1);

    const col2 = document.createElement('td');
    col2.setAttribute("class", "nTry")
    col2.innerHTML = history.nTry;
    row.appendChild(col2);

    const col3 = document.createElement('td');
    col3.setAttribute("class", "guessedWord")
    col3.innerHTML = history.guessedWord;
    row.appendChild(col3);

    const col4 = document.createElement('td');
    col4.setAttribute("class", ((history.win) ? "won" : "lose"))
    col4.innerHTML = ((history.win) ? "Gagné" : "Perdu");
    row.appendChild(col4);
}

/**
 * 
 * @param {string} word Mot deviné par l'utilisateur
 * @param {boolean} win Booléen indiquant si l'utilisateur a gagné ou non
 */
function setHistory(word, win) {
    var totalGames = 0
    if (localStorage.getItem("totalGames") == null) {
        localStorage.setItem("totalGames", 1);
    } else {
        totalGames = parseInt(localStorage.getItem("totalGames"));
        localStorage.setItem("totalGames", totalGames + 1);
    }
    localStorage.setItem(totalGames + 1, JSON.stringify({
        "wordToGuess": randomWord,
        "nTry": Nguess + 1,
        "guessedWord": word,
        "win": win
    }))
}

//#endregion


//#region EventsListeners

document.getElementById('motus').addEventListener('click', focusCell);
window.addEventListener('keydown', getKeyboardEntries);

//#endregion

startGame();