# La souris

## Niveau pas terminé !!
Ce niveau est en brouillon.

Ce serait pratique, si on pouvait dire au héros où il doit aller en cliquant, non ?

Eh bien c’est possible.

En général, les programmeurs utilisent ce qu'on appelle des gestionnaires d’événements.

Un événement, c’est, par exemple, un clic de souris, un mouvement de souris, une frappe
de clavier, etc.

Un gestionnaire d’événements, c’est une fonction qui va traiter un type particulier
d’événements : à chaque fois que cet événement se produit, le gestionnaire sera
appelé et recevra les détails de l’événement (par exemple, si c’est un gestionnaire de
clic de souris, le gestionnaire recevra l’information sur l’endroit où l’utilisateur a
cliqué.

```
jeu.gestionnaireClic = function (clic) {
    joueur.destination(clic.x, clic.y);
};
```

