# TP-MOTUS - Dumas & Jobin

***

## Table of Contents

1. [Informations Générales](#1-informations-générales)
2. [Fonctionnalités](#2-fonctionnalités)
3. [Fonctionnalités Manquantes](#3-fonctionnalités-manquantes)
4. [Structure du localStorage](#4-structure-du-localstorage)

***

## 1. Informations Générales

Présentation de la région de Termina avec le grand jeu du mois : le MOTUS, adapté en version Web par Mathéo JOBIN et Raphaël DUMAS
Vous y retrouverez également plusieurs informations sur les différents lieux de la région, ainsi qu'un formulaire de réservation de voyage offrant de nombreuses options.


***

## 2. Fonctionnalités implantées

- Choix aléatoire du mot parmi les dictionnaires de 5 à 10 lettres
- Génération dynamique du tableau en fonction du nombre de lettres du mot
- Affichage de la 1er lettre et des lettres valides à chaque tour
- Bouton de validation à la fin de chaque ligne (en fonction de celle qui est "utilisée")
- Coloration des cases en fonction de la validité des lettres au moment de la vérification
- Affichage & saisie des lettres dans le tableau sans inputs
- Vérification de la validité du mot entré via le dictionnaire
- Mémorisation et affichage des dernières parties

***

## 3. Fonctionnalités Manquantes

- Affichage d'un modal en fin de partie indiquant le résumé de la partie, le résultat (victoire ou défaite) et la proposition de relancer une nouvelle partie.
- Implémentation d'un clavier sous la grille pour des potentiels joueurs sur mobile
- Gestion des doublons (une lettre proposée 2 fois se colore 2 fois alors qu'elle n'est présente qu'une fois dans le mot)

## 4. Structure du localStorage

```JSON
localStorage: {
    totalGames : 2,
    1: {
        "wordToGuess": SecretWord,
        "nTry": number of try to guess the word,
        "guessedWord": wordGuessedByUser,
        "win": boolean
    },
    2: {
        "wordToGuess": SecretWord,
        "nTry": number of try to guess the word,
        "guessedWord": wordGuessedByUser,
        "win": boolean
    }
}
```

## 5. Bug connus
- [ ] bouton guess not found
- [ ] replay doubles grilles
- [ ] changer couleurs fin de partie
- [ ] virer bouton replay quand cliqué
- [ ] Bug au bout de 4(?) parties
