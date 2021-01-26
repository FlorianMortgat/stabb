# Bienvenue
Bienvenue dans ce jeu-découverte sur la programmation. Ce jeu ne va pas
t’apprendre à programmer de A à Z, mais va essayer d’éveiller ta
curiosité et ton sens de l’astuce.

Pour démarrer, appuie sur la touche `F12` du clavier. Ça fera
apparaître un panneau dans le navigateur (Firefox ou Chrome).

Ce panneau doit avoir un onglet "Console". Clique dessus : tu vas
pouvoir commencer à coder dans cette console. Ce code sera écrit en
**Javascript** (c'est le *langage de programmation* de ce jeu).

>Cette console Javascript fait partie du navigateur :
tu peux t'en servir sur n'importe quelle page web, pas seulement dans
ce jeu-là.


Le but du jeu est de faire sortir le joueur (la bille verte) par la
porte en prenant d’abord la clé, et sans se faire tuer par les
ennemis (en rouge).

>Si jamais tu perds, ce n’est pas grave tu peux recommencer autant de
fois que tu veux.

Pour le moment, le code ne va pas être trop compliqué.

Pour démarrer le jeu, dans la console, tape :
```
jeu.démarrer();
```

Ensuite, toujours dans la console, tape :

```
joueur.allerVersClé();
```

puis appuie sur Entrée.

>C’est important de ne faire aucune faute de frappe, y compris dans
>les majuscules et les minuscules. Dans le doute, fais un copier-coller.

Cette commande a donné pour instruction au personnage représenté par
le rond vert de se déplacer vers la clé.

Une fois que le personnage a pris la clé :

```
joueur.allerVersPorte();
```

Lorsque le joueur aura atteint la porte, tu auras gagné et le code
du niveau 1 s’affichera à l’écran.