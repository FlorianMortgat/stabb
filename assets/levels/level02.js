(function () {
    window.app.installLevel({
        initLevel(app) {
            console.log('Niveau 2');
            app.setupLevel();
            app.levels.ready = true;
            app.checkReady();
        },
        setupLevel(app) {
            let ennemyCount = 3;
            for (let i = 0; i < ennemyCount; i++) {
                let ennemy = new Player(
                    app,
                    app.assetDir + '/ennemy.png',
                    460 + Math.random() * 80,
                    80 + Math.random() * 350,
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
            app.ssword = new StaticObject(
                app,
                app.assetDir + '/ssword.png',
                620,
                253,
                15,
                73,
                'ssword'
            );
            window.clé = app.key;
            window.porte = app.door;
            window.épée = app.ssword;
            app.drawable.push(app.key, app.door, app.ssword);
        },
        /**
         * 
         * @param {Object} app
         */
        update(app) {
            
            // on vérifie si le joueur a la clé
            let playerHasKey = app.protagonist.items.some((i) => i === app.key);
            let playerHasSsword = app.protagonist.items.some((i) => i === app.ssword);
            
            // si le joueur n'a pas la clé et qu'il la prend:
            if (!playerHasKey && app.hasCollision(app.protagonist, app.key)) {
                // TODO: use splice to replace the contents of the array rather than reassigning
                //       (not because of performance, but because of potential outdated references
                //       in other objects)
                app.drawable = app.drawable.filter((i) => i !== app.key);
                app.protagonist.items.push(app.key);
            }
            // si le joueur n'a pas l’épée et qu'il la prend:
            if (!playerHasSsword && app.hasCollision(app.protagonist, app.ssword)) {
                app.drawable = app.drawable.filter((i) => i !== app.ssword);
                app.protagonist.items.push(app.ssword);
                app.protagonist.attack = 10;
            }
            
            // si le joueur a la clé et qu'il va sur la porte:
            if (playerHasKey && app.hasCollision(app.protagonist, app.door)) {
                app.finish('Gagné ! Le code du niveau est "'
                    + decode('Y\\[WXW')
                    + '". Note-le pour prouver que tu as terminé le niveau.'
                );
                app.setLevelCompleted();
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
    