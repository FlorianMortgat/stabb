# La souris

Ce serait pratique, si on pouvait dire au héros où aller en cliquant, non ?

C’est ce que tu vas programmer dans ce niveau.

Dans les jeux de ce type, les mouvements de souris, les clics, les frappes de clavier
etc. sont appelés des **événements** et les programmeurs créent des fonctions qui
s’appellent des **gestionnaires d’événements**.

En général, un gestionnaire d’événements traite un type particuer d’événements. Ici,
celui que tu vas écrire va s'occuper des clics de souris. Son nom sera
`jeu.gestionnaireClic`: elle sera appelée automatiquement quand l'utilisateur
cliquera (pas besoin de l’appeler toi-même). Elle recevra automatiquement une
*variable* `clic` qui aura deux *attributs* : `x` et `y` (les coordonnées du
clic).

Pour l’instant, on n’a pas utilisé le mot *variable*, mais on en a déjà utilisé :
une variable, c’est un nom qui est donné à quelque chose dans le programme.

Par exemple, dans le niveau précédent, `clé` était une variable qui représentait la
clé. On avait utilisé `clé.x` et `clé.y` : `x` et `y` étaient deux *attributs*
de la variable `clé` (des attributs, ce sont en quelque sorte des sous-variables).

Ici, c’est pareil : la variable `clic` aura aussi deux attributs `x` et `y`.

Dans le niveau précédent, la fonction que tu as programmé appelait une autre fonction
`joueur.destination` et lui donnait `clé.x` et `clé.y`. `joueur.destination`
donnait une destination au héros.

Ici, tu vas faire pareil : à toi de remplacer les `…` par ton propre code.

```
jeu.gestionnaireClic = function (clic) {
    …
};
```

Quand tu auras créé la fonction dans la console, démarre le jeu avec
```
jeu.démarrer();
```

Puis clique là où tu veux que le héros aille.
