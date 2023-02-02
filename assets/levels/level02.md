# Les fonctions

Bravo !Tu as réussi le niveau 1 !

Que s’est-il passé ?

Quand tu as tapé `jeu.start()`, `joueur.goToKey()` puis
`joueur.goToPlanet()`, tu as fait ce qu'on appelle *appeler des fonctions*.

* **appeler** = lancer (mais on n'utilise pas "lancer" pour une fonction)
* **fonction** = une sorte de sous-programme à l'intérieur du programme

Les parenthèses `()` à la fin du nom de la fonction sont très importantes : sans
elles, la fonction n'est pas *appelée*. Essaye par exemple de taper juste le
nom puis Entrée :

```
jeu.start
```

Dans la console s’affiche juste une description de la fonction (qui pour le
moment ne nous intéresse pas).

La fonction `jeu.start` sert à démarrer l'action du jeu.

Maintenant, essaye de taper :

Essaye de taper (ou copier-coller) :
```
jeu.start();
joueur.allerVersÉpée();
```

Que se passe-t-il ? Quelle est la différence avec les autres fonctions ?

Le message d’erreur (en anglais) t'explique que la fonction `allerVersÉpée`
n’existe pas sur l’objet `joueur`. En effet, les fonctions doivent être programmées
avant d’être utilisées. Si tu as pu utiliser `jeu.goToKey` et
`joueur.goToPlanet`, c’est parce que ces fonctions ont été programmées dans le
jeu, mais j’ai fait exprès de ne pas mettre de fonction `joueur.allerVersÉpée`.

Voyons maintenant comment a été programmée la fonction `joueur.goToKey`. Cette
fonction ne téléporte pas directement le joueur sur la clé : elle lui donne
simplement une destination, un objectif, sous forme de coordonnées.

Voilà le code (pas la peine de le mettre dans la console) :
```javascript
joueur.goToKey = function() {
    joueur.destination(clé.x, clé.y);
};
```

Ce code n’appelle pas (ne lance pas) la fonction mais la crée pour qu'elle puisse
ensuite être appelée avec `joueur.goToKey()`.

Serais-tu capable, en copiant cet exemple et en modifiant juste ce qu’il faut, de
programmer la fonction `joueur.allerVersÉpée` qui n’existe pas encore, de façon à
ce qu'elle fasse aller le héros vers l’épée (qui s’appelle `épée`) ?

À toi de jouer !!

>Attention : si le héros meurt, le niveau redémarre et la fonction que tu
as programmée disparait. Dans la console, tu peux utiliser la touche haut pour
récupérer ce que tu as tapé en dernier et le modifier (c’est l’historique) :
c’est plus pratique que de tout retaper une deuxième fois.

Quand tu auras créé la fonction dans la console, démarre le jeu avec
```
jeu.start();
```

et n’oublie pas de l’appeler avec

```
joueur.allerVersÉpée();
```
