class StaticObject {
    constructor(app, png, x, y, width, height) {
        this.app = app;
        this.png = png;
        this.ready = false;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.spritesheet = new Image();
        this.spritesheet.src = png;
        this.spritesheet.addEventListener('load', () => this.spritesheetLoaded());
    };

    spritesheetLoaded() {
        this.ready = true;
    };

    draw(ctx) {
        ctx.drawImage(
            this.spritesheet,
            0,
            0,
            this.width,
            this.height,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    };
}

class Player {
    constructor(app, png, x, y, targetX, targetY, speed = 1) {
        this.png = png;
        this.ready = false;
        this.app = app
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 24;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.direction = 'w';
        this.items = [];

        this.animation = {
            mspf: 1000 / 12, // milliseconds per frame ( = 1000 / fps )
            currentCycle: 'n',
            currentFrame: 0,
            width: 24,
            height: 24,
            frameCount: 4,
            currentShiftX() { return this.currentFrame * this.width; },
            currentShiftY() { return this.cycles[this.currentCycle] * this.height; },
            // north east south west idle
            cycles: {
                n: 0, e: 1, s: 2, w: 3,
                ne: 4, se: 5, sw: 6, nw: 7,
            }
        };
        this.spritesheet = new Image();
        this.spritesheet.src = png;
        this.spritesheet.addEventListener('load', () => this.spritesheetLoaded());
    };

    update(now) {
        if (!this.ready) return;

        let deltaX = this.targetX - this.x,
            deltaY = this.targetY - this.y,
            dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

        this.move();

        this.animation.currentCycle = this.direction;

        if (now % this.animation.mspf <= this.app.refreshRate) {
            this.animation.currentFrame = (this.animation.currentFrame + 1) % this.animation.frameCount;
        }
    };

    /**
     * Update this.direction, this.x, this.y depending on target and speed
     */
    move() {
        if (!this.speed) { return; }
        let deltaX = this.targetX - this.x,
            deltaY = this.targetY - this.y,
            dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
            speedX,
            speedY;
    
        if (dist < this.speed) {
            // player is almost at destination
            speedX = deltaX;
            speedY = deltaY;
        } else {
            // player is not yet arriving at destination
            speedX = deltaX * this.speed / dist;
            speedY = deltaY * this.speed / dist;
        }
        this.x += speedX;
        this.y += speedY;
        this.determineDirection(deltaX, deltaY, dist);
    };

    /**
     * Determines the direction of the player (for animation): North, South, East, West
     *
     * @param {number} deltaX 
     * @param {number} deltaY 
     * @param {number} dist 
     */
    determineDirection(deltaX, deltaY, dist) {
        // determine direction
        if (!dist) return;

        if (!deltaY || 4 * Math.abs(deltaY) < dist) {
            // horizontal
            return this.direction = (deltaX > 0) ? 'e' : 'w';
        } else if (!deltaX || 4 * Math.abs(deltaX) < dist) {
            // vertical
            return this.direction = (deltaY > 0) ? 's' : 'n';
        }

        // oblique
        let ns = (deltaY > 0) ? 's' : 'n';
        let ew = (deltaX > 0) ? 'e' : 'w';
        return this.direction = ns + ew;
    }

    draw(ctx) {
        ctx.drawImage(
            this.spritesheet,
            this.animation.currentShiftX(),
            this.animation.currentShiftY(),
            this.animation.width,
            this.animation.height,
            this.x - this.animation.width / 2,
            this.y - this.animation.height / 2,
            this.animation.width,
            this.animation.height
        );
    };

    spritesheetLoaded() {
        this.ready = true;
    };

    destination(x, y) {
        this.targetX = x;
        this.targetY = y;
    };

    téléporter(x, y) {
        this.x = x;
        this.y = y;
    };

    allerVersClé() {
        this.destination(window.clé.x, window.clé.y);
    };

    allerVersPorte() {
        this.destination(window.porte.x, window.porte.y);
    };
}

let distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));


let app = {
    refreshRate: 25,
    assetDir: 'assets',
    init(root) {
        this.root = root;
        this.scene = root.querySelector('.stabb .scene_c');
        this.info = root.querySelector('.stabb .info');
        this.edit = root.querySelector('.stabb .edit');

        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('mousedown', e => {
            let x = e.clientX - this.rect.left;
            let y = e.clientY - this.rect.top;
            //if (e.button === 0) this.leftclick(x, y);
            //else if (e.button === 2) this.rightclick(x, y);
        });
        let ctx = this.ctx = this.canvas.getContext('2d');
        this.initCanvasSize();
        window.addEventListener('resize', () => this.initCanvasSize());
        // empêcher le clic droit d'ouvrir le menu contextuel sur le canvas.
        this.canvas.addEventListener('contextmenu', (ev) => {
            ev.preventDefault();
            return false;
        })
        $(this.canvas).appendTo($(this.scene));
    },
    initCanvasSize() {
        this.canvas.width = $('.scene_c').width();
        this.canvas.height = $('.scene_c').height();
        this.rect = this.canvas.getBoundingClientRect();
    },
    clear(color = 'black') {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(1, 1, this.canvas.width, this.canvas.height);
    },
    // leftclick(x, y) {
    //     this.player.destination(x, y);
    // },
    // rightclick(x, y) {
    //     this.player.téléporter(x, y);
    // },
    main() {
        let now = Date.now();
        this.clear();
        this.detectCollisions();
        // make all characters move
        this.characters.forEach((p) => p.update(now));
        // draw all drawable objects
        this.drawable.forEach((o) => o.draw(this.ctx));

        if (this.i % 10 === 0) {
            this.ennemies.forEach((e) => e.destination(this.protagonist.x, this.protagonist.y));
        }

        this.i++;
        if (this.i > 10000000) {
            this.stop();
            console.log('the end');
            this.clear();
        }
    },
    // selectPlayer(i) {
    //     return this.player = window.joueur = this.players[i % this.players.length];
    // },


    // TODO: détection des collisions / des distances pour permettre interactions entre objets
    // TODO: passer les noms de variables exposées en français ☺
    run() {
        this.i = 0;
        let running = true;
        let self = this;
        this.protagonist = new Player(this, this.assetDir + '/hero.png', self.canvas.width / 2, self.canvas.height / 2, Math.random() * self.canvas.width, Math.random() * self.canvas.height, 2);
        this.ennemies = [
            new Player(this, this.assetDir + '/ennemy.png', 710, Math.random() * 300, 0, 0, 0.6),
            new Player(this, this.assetDir + '/ennemy.png', 710, Math.random() * 300, 0, 0, 0.5),
        ];

        // characters = protagonist + ennemies
        this.characters = window.characters = [this.protagonist];
        this.characters.push(...this.ennemies);

        this.key = new StaticObject(this, this.assetDir + '/key.png', 350, 56, 32, 17);
        this.door = new StaticObject(this, this.assetDir + '/door.png', 45, 306, 64, 64);
        window.clé = this.key;
        window.porte = this.door;
        window.joueur = this.protagonist;

        this.drawable = [this.key, this.door];
        this.drawable.push(...this.characters);

        // this.collidable = [this.protagonist];
        // this.collidable.push(...this.ennemies);
        // this.collidable.push(this.key);
        // this.collidable.push(this.door);

        // there is certainly a better way to make unique pairs
        // this.collidable.forEach( (objA, objA_i) => {
        //     for (let objB_i = 0; objB_i < this.collidable.length; objB_i++) {
        //         if (objA_i === objB_i) continue;
        //         pairId = '' + objA_i + '_' + objB_i;
        //         if (this.collisionPairs[pairId]) continue;
        //         pairId = '' + objB_i + '_' + objA_i;
        //         if (this.collisionPairs[pairId]) continue;
        //         let objB = this.collidable[objB_i];
        //         this.collisionPairs[pairId] = {
        //             a: objA,
        //             b: objB,
        //             collided: false,
        //         };
        //         this.collisionPairs.order.push(pairId);
        //     }
        // });

        // this.selectPlayer(0);
        this.pid = window.setInterval(() => this.main(), this.refreshRate);
    },
    hasCollision(a, b) {
        return distance(a.x, a.y, b.x, b.y) < a.width / 2 + b.width / 2;
    },
    detectCollisions() {
        this.ennemies.forEach((e) => {
            if (this.hasCollision(this.protagonist, e)) {
                setTimeout(() => {
                    console.log('perdu');
                    this.stop();
                    this.clear('red');
                }, 0);
            }
        });
        let playerHasKey = this.protagonist.items.some((i) => i === this.key);
        if (!playerHasKey && this.hasCollision(this.protagonist, this.key)) {
            this.drawable = this.drawable.filter((i) => i !== this.key);
            this.protagonist.items.push(this.key);
        }
        console.log(playerHasKey);
        if (playerHasKey && this.hasCollision(this.protagonist, this.door)) {
            setTimeout(() => {
                console.log('gagné');
                this.stop();
                this.clear('white');
            }, 0);
        }
        // this.collisionPairs.forEach((pair) => {
        //     if (distance(pair.a.x, pair.a.y, pair.b.x, pair.b.y) < 25) {
        //         pair.collided = true;
        //     }
        // });
    },
    stop() {
        window.clearInterval(this.pid);
    },
};

function main() {
    app.init(document.body);
    app.run();
    // window.sélectionnerJoueur = i => app.selectPlayer(i);
    window.stop = app.stop;
}

$(main);



window.levels = [

];