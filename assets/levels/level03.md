# Les boucles

But du niveau :
* le niveau démarre avec 8 ennemis
* pas d’épée
* objectif : créer 15 "alliés" (bonhommes verts) scriptés pour aller sur les ennemis.
* → les premiers à la main, les suivants avec une boucle while

```
i = 0;
jeu.créerAllié = function () {
    ……………
}

jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
jeu.créerAllié();
while (i++ < 15) {
    jeu.créerAllié();
}
```