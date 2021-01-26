(function () {
    window.app.installLevel({
        initLevel(app) {
            console.log('Niveau 4');
            app.setupLevel();
            app.levels.ready = true;
            app.checkReady();
        },
        setupLevel(app) {
            let ennemyCount = 30;
            for (let i = 0; i < ennemyCount; i++) {
                let ennemy = new Player(
                    app,
                    app.assetDir + '/ennemy.png',
                    500,
                    Math.random() * 300,
                    0,
                    0,
                    prng.nextInt(1,10) / 5,
                    'Ennemi ' + (i+1)
                );
                ennemy.hp = prng.nextInt(5,10);
                ennemy.initialhp = ennemy.hp;
                app.ennemies.push(ennemy);
            }
            
            app.friends = [];
            app.créerNouvelAmi = function() {
                let friend = new Player(
                    app,
                    app.assetDir + '/friend.png',
                    Math.random() * app.canvas.width,
                    Math.random() * app.canvas.height,
                    0,
                    0,
                    prng.nextInt(1,7),
                    'Ami ' + app.friends.length + 1
                );
                friend.hp = prng.nextInt(3,8);
                friend.initialhp = friend.hp;
                friend.animation.width = 18;
                friend.animation.height = 18;
                app.friends.push(friend);
                let now = Date.now();
                // friend.update(now);
                friend.spritesheetLoaded = () => {
                    friend.ready = true;
                    friend.draw(app.ctx);
                };
                app.drawable.push(friend);
                app.characters.push(friend);
            };
            /**/
            for (let i = 0; i < 2; i++) {
                app.créerNouvelAmi();
            }
            /**/

            app.key = new StaticObject(
                app,
                app.assetDir + '/key.png',
                600,
                20,
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
            // app.ssword = new StaticObject(
            //     app,
            //     app.assetDir + '/ssword.png',
            //     620,
            //     253,
            //     15,
            //     73,
            //     'ssword'
            // );
            window.clé = app.key;
            window.porte = app.door;
            // window.épée = app.ssword;
            app.drawable.push(app.key, app.door);
            app.gestionnaireClic = function (clic) {
                app.protagonist.destination(clic.x, clic.y);
            };
        },
        /**
         *
         * @param {Object} app
         */
        update(app) {
            
            // on vérifie les collisions entre les amis et les ennemis
            app.friends.forEach((f) => {
                if (!f.alive()) return;
                if (f.acquiredEnnemy && f.acquiredEnnemy.alive()) {
                    // if the friend has an acquired ennemy that is alive, check collision
                    // if there is a collision, make them fight.
                    f.isInCollision = false;
                    if (app.hasCollision(f, f.acquiredEnnemy)) {
                        f.isInCollision = true;
                        f.acquiredEnnemy.isInCollision = true;
                        if (app.i % 15 === 0) {
                            f.attackOther(f.acquiredEnnemy);
                            f.acquiredEnnemy.attackOther(f);
                        }
                    }
                    // les amis doivent suivre les ennemis
                    if (app.i % 10 === 0) f.destination(
                        f.acquiredEnnemy.x,
                        f.acquiredEnnemy.y
                    );
                } else {
                    // if the friend has no acquired ennemy, pick the closest
                    let d = 0xffffff; // arbitrarily large number
                    app.ennemies.forEach((e) => {
                        if (!e.alive()) return;
                        let dd = distance(f.x, f.y, e.x, e.y);
                        if (dd < d) {
                            d = dd;
                            f.acquiredEnnemy = e;
                        }
                    });
                }
            });

            // on vérifie si le joueur a la clé
            let playerHasKey = app.protagonist.items.some((i) => i === app.key);
            // let playerHasSsword = app.protagonist.items.some((i) => i === app.ssword);

            // si le joueur n'a pas la clé et qu'il la prend:
            if (!playerHasKey && app.hasCollision(app.protagonist, app.key)) {
                // TODO: use splice to replace the contents of the array rather than reassigning
                //       (not because of performance, but because of potential outdated references
                //       in other objects)
                app.drawable = app.drawable.filter((i) => i !== app.key);
                app.protagonist.items.push(app.key);
            }
            // si le joueur n'a pas l’épée et qu'il la prend:
            // if (!playerHasSsword && app.hasCollision(app.protagonist, app.ssword)) {
            //     app.drawable = app.drawable.filter((i) => i !== app.ssword);
            //     app.protagonist.items.push(app.ssword);
            //     app.protagonist.attack = 10;
            // }

            // si le joueur a la clé et qu'il va sur la porte:
            if (playerHasKey && app.hasCollision(app.protagonist, app.door)) {
                app.finish('BRAVO ! Le code du niveau est "'
                    + decode('STUWXY')
                    + '". Note-le pour prouver que tu as terminé le jeu !'
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
    