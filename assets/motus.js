import { dictionary_list } from './words.js';

let Nguess;
let randomWord;
let guessedWord = new Map();
let currentFocusedCell;

/**
 * LocalStorage history structure
 * @typedef {Object} gameHistory
 * @property {string} randomWord - Mot à deviner
 * @property {int} nTry - Nombre d'essais
 * @property {string} guessedWord - Mot donné par l'utilisateur
 * @property {boolean} win - Si le joueur a gagné ou non
 */

// --------------------- Structure local storage ---------------------
// {
//     1: <-- Game Number
//         {
//             "wordToGuess": randomWord,
//             "nTry": Nguess + 1,
//             "guessedWord": word,
//             "win": true
//         },
//     2: <-- Game Number
//         {
//             "gameNumber": 2,
//             "wordToGuess": randomWord,
//             "nTry": Nguess + 1,
//             "guessedWord": word,
//             "win": true
//         }
//     ]
// }

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
    randomWord = dictionary_list[Math.floor(Math.random() * 5)][Math.floor(Math.random() * randomDictionnary.length)];
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
        tBody.appendChild(row);
    }
    tHead.appendChild(tBody);
    table.appendChild(tHead);
    currentFocusedCell = 1;
    console.log(randomWord)
}

// Deprecated
// function generateGameTable() {
//     let table = document.getElementById("motus");
//     let tBody = document.createElement("tbody");
//     let count = 1;
//     for (let i = 0; i < 6; i++) {
//         const row = document.createElement('tr');
//         row.setAttribute("id", ("line" + i));
//         row.setAttribute("class", ("motus"));

//         for (let j = 0; j < randomWord.length + 1; j++) {
//             const col = document.createElement('td');
//             col.setAttribute("border", "20");
//             col.setAttribute("id", `cell${count}`);
//             col.setAttribute("class", "motus");
//             if (i == 0) {
//                 if (j == 0) {
//                     col.innerHTML = randomWord[0];
//                     col.setAttribute("class", 'right');
//                 } else if (j == randomWord.length) {
//                     const confirmButton = document.createElement('button');
//                     confirmButton.setAttribute("type", "submit");
//                     confirmButton.setAttribute("class", "btn btn-motus");
//                     confirmButton.setAttribute("onclick", "guess()");
//                     col.setAttribute("class", 'send');
//                     col.appendChild(confirmButton);
//                 } else {
//                     col.setAttribute("class", 'guessing');
//                     generateInput(col, count);
//                 }
//             } else if (j == randomWord.length) {
//                 col.setAttribute("class", 'send');
//             }
//             row.appendChild(col);
//             count++;
//         }
//         tBody.appendChild(row);
//     }
//     table.appendChild(tBody);
//     console.log(randomWord)
// }

//Deprecated
/**
 * Génère les champs de saisie dans le tableau
 * @param {int} cell cellule à remplir
 * @param {int} number id de l'input
 */
// function generateInput(cell, number) {
//     const input = document.createElement('input');
//     input.setAttribute('type', 'text');
//     input.setAttribute('maxlength', '1');
//     input.setAttribute('name', 'guessCell');
//     input.setAttribute('class', 'guessCell');
//     input.setAttribute('onkeyup', 'moveCursor(event)');
//     input.setAttribute('required', '');
//     input.setAttribute('id', number);
//     cell.appendChild(input);
// }

/**
 * Teste si les cases sont vides, et si non, vérifie le mot donné par l'utilisateur
 */

function guess() {
    if (areEmptyFields()) {
        alert('Remplissez tous les champs');
    } else {
        var word = "";
        for (var [key, value] of guessedWord) {
            if (value) {
                word += randomWord[key];
            } else {
                word += document.getElementById(`cell${Nguess + "-" + key}`).innerHTML;
            }
        }
        console.log("Word ? " + word);

        // if (dictionary_list[randomWord.length].includes(word)) {} else {
        //     alert("Le mot n'est pas dans le dictionnaire");
        // }
        document.getElementById(`cell${Nguess + "-" + randomWord.length}`).innerHTML = "";
        if (word == randomWord) {
            for (let i = 0; i < randomWord.length; i++) {
                const cell = document.getElementById(`cell${Nguess + "-" + i}`);
                cell.setAttribute('class', 'won');
                cell.innerHTML = randomWord[i - 1];
            }
            setHistory(word, true);
            askForNewGame();
        } else if (Nguess == 5) {
            for (let [key, value] of guessedWord) {
                const cell = document.getElementById(`cell${Nguess + "-" + key}`);
                if (value) {
                    cell.setAttribute('class', 'right');
                } else {
                    cell.setAttribute('class', 'false');
                }
                cell.innerHTML = randomWord[key];
            }
            setHistory(word, false);
            askForNewGame();
        } else {
            Nguess++;
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
            confirmButton.setAttribute("onclick", "guess()");
            confirm.setAttribute("class", 'send');
            confirm.appendChild(confirmButton);
        }

    }
}

//Deprecated
// function guess() {
//     console.log(randomWord)
//     if (areEmptyFields()) {
//         alert('Remplissez tous les champs');
//     } else {
//         var word = "";
//         for (var [key, value] of guessedWord) {
//             if (value) {
//                 word += randomWord[key - 1];
//             } else {
//                 word += document.getElementById(key).value;
//             }
//         }
//         console.log(word);

//         // if (dictionary_list[randomWord.length].includes(word)) {} else {
//         //     alert("Le mot n'est pas dans le dictionnaire");
//         // }
//         document.getElementById(`cell${(Nguess + 1) * 7}`).innerHTML = "";
//         if (word == randomWord) {
//             for (let i = 1; i < 7; i++) {
//                 const cell = document.getElementById(`cell${(Nguess) * 7 + i}`);
//                 cell.setAttribute('class', 'won');
//                 cell.innerHTML = randomWord[i - 1];
//             }
//             setHistory(word, true);
//             askForNewGame();
//         } else if (Nguess == 5) {
//             for (var [key, value] of guessedWord) {
//                 const cell = document.getElementById(`cell${(Nguess) * 7 + key}`);
//                 if (value) {
//                     cell.setAttribute('class', 'right');
//                 } else {
//                     cell.setAttribute('class', 'false');
//                 }
//                 cell.innerHTML = randomWord[key - 1];
//             }
//             setHistory(word, false);
//             askForNewGame();
//         } else {
//             Nguess++;
//             for (var [key, value] of guessedWord) {
//                 const nextcell = document.getElementById(`cell${Nguess * 7 + key}`);
//                 const cell = document.getElementById(`cell${(Nguess - 1) * 7 + key}`);
//                 if (value || word[key - 1] == randomWord[key - 1]) {
//                     cell.setAttribute('class', 'right');
//                     cell.innerHTML = randomWord[key - 1];
//                     nextcell.setAttribute('class', 'right');
//                     nextcell.innerHTML = randomWord[key - 1];
//                     guessedWord.set(key, true);
//                 } else if (randomWord.includes(word[key - 1])) {
//                     cell.setAttribute('class', 'wrongPlace');
//                     cell.innerHTML = word[key - 1];
//                     nextcell.setAttribute('class', 'guessing');
//                     generateInput(nextcell, key);
//                 } else {
//                     cell.setAttribute('class', 'false');
//                     cell.innerHTML = word[key - 1];
//                     nextcell.setAttribute('class', 'guessing');
//                     generateInput(nextcell, key);
//                 }
//             }
//             for (var [key, value] of guessedWord) {
//                 if (!value) {
//                     document.getElementById(key).focus();
//                     break;
//                 }
//             }
//             const confirm = document.getElementById(`cell${(Nguess + 1) * 7}`);
//             const confirmButton = document.createElement('button');
//             confirmButton.setAttribute("type", "submit");
//             confirmButton.setAttribute("class", "btn btn-motus");
//             confirmButton.setAttribute("onclick", "guess()");
//             confirm.setAttribute("class", 'send');
//             confirm.appendChild(confirmButton);
//         }

//     }
// }

/**
 * 
 * @returns {boolean} true si tous les champs sont vides, false sinon 
 */
function areEmptyFields() {
    let empty = false
    for (var [key, value] of guessedWord) {
        if (!value && document.getElementById(`cell${Nguess + "-" + key}`).innerHTML == "") {
            empty = true;
        }
    }
    return empty
}

/**
 * Demande à l'utilisateur s'il veut rejouer, et régénère un plateau si oui
 */
function askForNewGame() {
    if (confirm('Voulez-vous rejouer ?')) {
        document.getElementById('motus').innerHTML = "";
        startGame();
    }
}

//#endregion


//#region Ergonomic

/**
 * Déplace le curseur vers la case suivante si la touche appuyée est une lettre
 * @param {event} e L'évènement de la touche appuyée
 */
function getKeyboardEntries(e) {
    if (e.key == "Enter" && Nguess < 6) { //Validation du mot
        guess();
    } else if (e.key == "Backspace") { //Suppression d'une lettre et recul du curseur
        if (currentFocusedCell > 0 && currentFocusedCell <= randomWord.length) {
            if (document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML == "" && currentFocusedCell > 1) {
                for(let i =currentFocusedCell-1; i>0; i--){
                    if(document.getElementById(`cell${Nguess + "-" + i}`).getAttribute("class") != "right"){
                        currentFocusedCell = i;
                        break;
                    }
                }
                document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = "";
            } else if (currentFocusedCell == randomWord.length - 1) {
                document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = "";
            }
        }
    } else if (/^[a-zA-ZÀ-ÖØ-öø-ÿ]$/u.test(e.key)) { //Ajout d'une lettre et avancée du curseur
        if (currentFocusedCell > 0 && currentFocusedCell < randomWord.length) {
            let value = e.key.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            document.getElementById(`cell${Nguess + "-" + currentFocusedCell}`).innerHTML = value.toUpperCase();
            for(let i =currentFocusedCell+1; i<randomWord.length; i++){
                if(document.getElementById(`cell${Nguess + "-" + i}`).getAttribute("class") != "right"){
                    currentFocusedCell = i;
                    break;
                }
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
    let tBody = document.createElement("tbody");
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
    table.appendChild(tBody);
}

/**
 * 
 * @param {HTMLTableRowElement} row Ligne à générer
 * @param {gameHistory} history Historique récupéré du localStorage
 */
function generateHistoryRow(row, history) {
    const col1 = document.createElement('td');
    col1.innerHTML = history.wordToGuess;
    row.appendChild(col1);

    const col2 = document.createElement('td');
    col2.innerHTML = history.nTry;
    row.appendChild(col2);

    const col3 = document.createElement('td');
    col3.innerHTML = history.guessedWord;
    row.appendChild(col3);

    const col4 = document.createElement('td');
    col4.innerHTML = ((history.win) ? "Gagné" : "Perdu");
    row.appendChild(col4);
}

/**
 * 
 * @param {string} word Mot deviné par l'utilisateur
 * @param {boolean} win Booléen indiquant si l'utilisateur a gagné ou non
 */
function setHistory(word, win) {
    localStorage.setItem(localStorage.length + 1, JSON.stringify({
        "wordToGuess": randomWord,
        "nTry": Nguess + 1,
        "guessedWord": word,
        "win": win
    }))
}

//#endregion


window.addEventListener('keydown', getKeyboardEntries);
startGame();