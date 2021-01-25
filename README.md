# Stabb - jeu pédagogique

## Principes

STABB est un jeu pédagogique en Javascript, dans lequel le joueur
va taper des commandes dans la console js de son navigateur pour
influer sur le jeu.

Au début, le joueur se contentera de copier-coller des lignes de
code sans avoir vraiment besoin de les comprendre.

Progressivement seront introduites des notions de programmation,
mais sans formalisme (le but n'est pas que stabb devienne un
outil ultime pour apprendre à programmer, mais d’éveiller la
curiosité du joueur par rapport à la programmation et aux notions
présentées).


## Nom
Que signifie STABB ? Rien de spécial, c’est juste un nom. Au
début, `sta` signifiait "stagiaire", mais je n’ai pas cherché
plus loin.

## Niveaux

Il est relativement facile d’ajouter des niveaux. Il suffit de
créer de nouveaux fichier dans assets/levels. Un niveau se compose
d’un fichier `levelXX.md` (contenant le texte d’accompagnement)
et d’un fichier `levelXX.js` (contenant le script du niveau).

L’interaction entre le script du niveau et le "moteur" de stabb
est encore largement perfectible. Pour l’instant, le niveau
définit un objet respectant une certaine interface (des méthodes
ayant un nom particulier qui sont appelées à diverses phases
du jeu).