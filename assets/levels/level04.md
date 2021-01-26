# Des alliés à la rescousse

Dans ce niveau, il y a beaucoup d’ennemis et ils sont plus rapides qu'avant.
Impossible de les éviter, et encore plus de les attaquer car il n'y
a pas d’épée.

Par contre, tu as des alliés.

Pour le moment, il n’y en a que 2.

À toi de programmer pour en avoir plus (au moins 50, mais tu peux en avoir
100 si tu veux) !

Pour créer un nouvel allié :

```
jeu.créerNouvelAmi();
```

Malheureusement, ça va être un peu pénible de taper ça 50 fois (ou même de
le copier-coller 50 fois).

C’est parce que les programmeurs n’aiment pas copier-coller des dizaines de
fois les mêmes choses qu’il existe des **boucles**.

## Les boucles

Les boucles sont un moyen de répéter le même morceau de code plusieurs fois.

Un exemple de boucle en javascript :

```
var n = 1;
while (n <= 5) {
    console.log('bonjour');
    n++;
}
```

Copie-colle cet exemple dans la console pour voir ce que ça fait.

La première ligne `var n = 1;` crée une variable nommée `n` qui vaut un
(`1`).

La deuxième ligne `while (n < 5)` signifie « tant que `n` est inférieur
ou égal à 5, répéter ce qui est entre les accolades `{` et `}`.

À l'intérieur des accolade (donc de notre boucle), on a une ligne
`console.log('bonjour');` qui écrit juste « bonjour » dans la console.

La ligne suivante `n++;` est très importante : elle fait augmenter `n` de
`1` (donc si `n` valait 1, `n` vaut maintenant 2, si `n` valait 5, `n` vaut
maintenant 6, etc.). On peut aussi écrire `n = n + 1;` mais c’est plus long.

>Si on ne met pas `n++;`, `n` restera toujours inférieur à 5 et la boucle ne
s’arrêtera jamais (on appelle ça une *boucle infinie* et il faut à tout prix
l’éviter).

Maintenant, si on remplace `console.log('bonjour');` par une instruction qui
crée un allié, on peut créer 5 alliés d’un coup.

Et si on remplace `while (n <= 5)` par `while (n <= 100)`, on en crée 100
d’un coup.

**À toi de jouer pour te créer des alliés !**

>N’exagère pas trop sur le nombre d’alliés : si tu en crées 10000 par
exemple, le PC va ramer à mort.

