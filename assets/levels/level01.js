(function () {
window.app.installLevel({
    initLevel(app) {
        console.log('Niveau 1');
        app.setupLevel();
    },
    setupLevel(app) {
        let ennemyCount = 2;
        for (let i = 0; i < ennemyCount; i++) {
            let ennemy = new Player(
                app,
                app.assetDir + '/ennemy.png',
                500,
                Math.random() * 300,
                0,
                0,
                prng.nextInt(1,10) / 10,
                'Ennemi ' + (i+1)
            );
            ennemy.hp = prng.nextInt(5,20);
            ennemy.initialhp = ennemy.hp;
            app.ennemies.push(ennemy);
        }

        app.key = new StaticObject(
            app,
            app.assetDir + '/key.png',
            350,
            56,
            74,
            20,
            'clé'
        );
        app.door = new StaticObject(
            app,
            app.assetDir + '/door.png',
            45,
            306,
            90,
            125,
            'porte'
        );
        window.clé = app.key;
        window.porte = app.door;
        app.drawable.push(app.key, app.door)
    },
    /**
     * 
     * @param {Object} app
     */
    update(app) {
        
        // on vérifie si le joueur a la clé
        let playerHasKey = app.protagonist.items.some((i) => i === app.key);
        
        // si le joueur n'a pas la clé et qu'il la prend:
        if (!playerHasKey && app.hasCollision(app.protagonist, app.key)) {
            // TODO: use splice to replace the contents of the array rather than reassigning
            //       (not because of performance, but because of potential outdated references
            //       in other objects)
            app.drawable = app.drawable.filter((i) => i !== app.key);
            app.protagonist.items.push(app.key);
        }
        
        // si le joueur a la clé et qu'il va sur la porte:
        if (playerHasKey && app.hasCollision(app.protagonist, app.door)) {
            app.finish('Gagné ! Le code du niveau est "'
                + decode('WSXVWZ')
                + '". Note-le pour prouver que tu as terminé le niveau.'
            );
        }
        if (!app.protagonist.alive()) {
            let n = 5;
            let refresher = () => {
                app.finish('Perdu ! Redémarrage dans ' + n + ' secondes.');
                if (n-- <= 0) {
                    window.clearInterval(interval);
                    app.setupLevel();
                }
            };
            let interval = window.setInterval(refresher, 1000);
            refresher();
        }

        if (app.i % 10 === 0) {
            app.ennemies.forEach(
                (e) => e.destination(
                    app.protagonist.x,
                    app.protagonist.y
                )
            );
        }
    },
});


})();
