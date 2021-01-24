

// TODO:
//  - créer une classe Animation distincte de la classe Player
//  - créer une classe Drawable qui sera le parent de Player et StaticObject
//  - renommer Player en Character
//  - créer une classe Collidable pour paramétrer les primitives 

class StaticObject {
    constructor(app, png, x, y, width, height, name) {
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
        this.name = name;
        this.spriteMargin = 2;
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
    constructor(app, png, x, y, targetX, targetY, speed = 1, name = 'nameless') {
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
        this.hp = 25;
        this.initialhp = this.hp;
        this.attack = 1;
        this.defense = 0;
        this.name = name;
        this.blinking = false;
        this.isInCollision = false;
        this.spriteMargin = 2;

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
        if (!this.alive()) return;
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
        if (this.isInCollision) {
            return;
        }
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
        if (!this.alive()) return;
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
        if (this.blinking && this.app.i % 8 < 4) {
            ctx.beginPath();
            ctx.arc(
                this.x,
                this.y,
                this.width / 2 - this.spriteMargin,
                0,
                2 * Math.PI,
                0
            );
            ctx.fillStyle = '#fff5';
            ctx.fill();
        } else {
            let hpRatio = this.hp / this.initialhp;
            if (isNaN(hpRatio)) hpRatio = 0;
            // we only display health bar if wounded
            if (hpRatio > 0.99) return;

            let barLength = this.width;
            let barHeight = 4;
            ctx.fillStyle = '#f00';
            ctx.fillRect(
                this.x - barLength / 2,
                this.y + this.height / 2 + 4,
                barLength,
                barHeight
            );
            ctx.fillStyle = '#0f0';
            ctx.fillRect(
                this.x - barLength / 2,
                this.y + this.height / 2 + 4,
                Math.floor(hpRatio * barLength),
                barHeight
            );
            // ctx.beginPath();
            // ctx.arc(
            //     this.x,
            //     this.y,
            //     this.width / 2 - this.spriteMargin,
            //     0,
            //     2 * Math.PI,
            //     0
            // );
            // let inverseHPRatioHex = Math.floor((1 - hpRatio) * 16).toString(16);
            // let fill = '#000' + inverseHPRatioHex;
            // if (this.app.i % 10===0) {
            //     console.log(inverseHPRatioHex);
            // }
            // ctx.fillStyle = fill;
            // ctx.fill();
        }
        
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

    attackOther(other) {
        let damage = Math.max(0, this.attack - other.defense);
        other.hp -= damage;
        other.hp = Math.max(0, other.hp);
        other.blinking = true;
        window.setTimeout(() => {other.blinking = false;}, 1000);
        //console.log('"' + this.name + '" inflige ' + damage + ' dégâts à ' + other.name + '. → ' + other.hp + '/' + other.initialhp + ' points de vie');
    };

    alive() {
        return this.hp > 0;
    };
}

let distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));


let app = {
    refreshRate: 25,
    assetDir: 'assets',
    ready: false,
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
        // if (this.stopped) return;
        this.canvas.width = $('.scene_c').width();
        this.canvas.height = $('.scene_c').height();
        this.rect = this.canvas.getBoundingClientRect();
        this.clear();
    },
    clear(color) {
        if (color === undefined) color = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //randomDots('#353535', 1000);
    },
    // leftclick(x, y) {
    //     this.player.destination(x, y);
    // },
    // rightclick(x, y) {
    //     this.player.téléporter(x, y);
    // },
    main() {
        if (!this.ready) return;
        this.ctx.fillStyle = '#222';
        let now = Date.now();
        this.clear();
        this.detectCollisions();

        if (!this.protagonist.alive()) {
            this.finish('Perdu !', 'red');
        }

        // make all characters move
        this.characters.forEach((p) => p.update(now));
        // draw all drawable objects
        this.drawable.forEach((o) => o.draw(this.ctx));

        if (this.i % 10 === 0) {
            this.ennemies.forEach((e) => e.destination(this.protagonist.x, this.protagonist.y));
        }

        this.i++;
        if (this.i > 10000000) {
            this.finish('Fini', 'black');
        }
    },
    // selectPlayer(i) {
    //     return this.player = window.joueur = this.players[i % this.players.length];
    // },


    prepare() {
        this.i = 0;
        let running = false;
        let self = this;
        this.protagonist = new Player(
            this,
            this.assetDir + '/hero.png',
            self.canvas.width / 2,
            self.canvas.height / 2,
            Math.random() * self.canvas.width,
            Math.random() * self.canvas.height,
            2,
            'Héros'
        );
        let ennemyCount = 2;
        this.ennemies = [];
        for (let i = 0; i < ennemyCount; i++) {
            let ennemy = new Player(
                this,
                this.assetDir + '/ennemy.png',
                500,
                Math.random() * 300,
                0,
                0,
                prng.nextInt(1,10) / 10,
                'Ennemi ' + (i+1)
            );
            ennemy.hp = prng.nextInt(5,20);
            ennemy.initialhp = ennemy.hp;
            console.log(ennemy.hp, ennemy.initialhp);
            this.ennemies.push(ennemy);
        }

        // characters = protagonist + ennemies
        this.characters = window.characters = [];
        this.characters.push(...this.ennemies);
        this.characters.push(this.protagonist);

        this.key = new StaticObject(this, this.assetDir + '/key.png', 350, 56, 74, 20, 'clé');
        this.door = new StaticObject(this, this.assetDir + '/door.png', 45, 306, 90, 125, 'porte');
        window.clé = this.key;
        window.porte = this.door;
        window.joueur = this.protagonist;

        this.drawable = [this.key, this.door];
        this.drawable.push(...this.characters);

        $.get('interface.php?get=levels', (data) => {
            this.levels = data.payload;
            $.get('interface.php?get=' + this.levels[0], (data) => {
                let html = window.markdownConverter.makeHtml(data.payload.text);
                $('.stabb .info_level > div').html(html);
                if (data.payload.js) {
                    let scriptTag = document.createElement('script');
                    scriptTag.type = 'application/javascript';
                    scriptTag.src = data.payload.js;
                    document.body.appendChild(scriptTag);
                }
                this.ready = true;
            });
        });
    },

    // TODO: passer les noms de variables exposées en français ☺
    run() {
        this.pid = window.setInterval(() => this.main(), this.refreshRate);
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
    },
    hasCollision(a, b) {
        return distance(a.x, a.y, b.x, b.y)
               <
               a.width / 2 - a.spriteMargin + b.width / 2 - b.spriteMargin;
    },
    detectCollisions() {
        this.protagonist.isInCollision = false;
        this.ennemies.forEach((e) => {
            if (!e.alive()) return;
            e.isInCollision = false;
            if (this.hasCollision(this.protagonist, e)) {
                this.protagonist.isInCollision = true;
                e.isInCollision = true;
                if (this.i % 15 === 0) {
                    this.protagonist.attackOther(e);
                    e.attackOther(this.protagonist);
                }
            }
        });
        let playerHasKey = this.protagonist.items.some((i) => i === this.key);
        if (!playerHasKey && this.hasCollision(this.protagonist, this.key)) {
            this.drawable = this.drawable.filter((i) => i !== this.key);
            this.protagonist.items.push(this.key);
        }
        if (playerHasKey && this.hasCollision(this.protagonist, this.door)) {
            this.finish('Gagné ! Le code est "' + decode('WSXVWZ') + '"', 'white');
        }
        // this.collisionPairs.forEach((pair) => {
        //     if (distance(pair.a.x, pair.a.y, pair.b.x, pair.b.y) < 25) {
        //         pair.collided = true;
        //     }
        // });
    },
    stop() {
        this.stopped = true;
        window.clearInterval(this.pid);
    },
    finish(message, bg) {
        window.setTimeout(() => {
            let endDiv = document.createElement('div');
            endDiv.id = 'endgame_msg';
            $(endDiv).html('<div class="finish_msg">' + message + '</div>');
            $(endDiv).appendTo($('.stabb .info_globale'));
            endDiv.classList.toggle('visible');
            this.stop();
            this.clear(bg);
            
        }, 0);
    },

    log(msg) {

    },
};

function main() {
    window.markdownConverter = new showdown.Converter();
    app.init(document.body);
    app.prepare();
    window.jeu = app;
    jeu.démarrer = jeu.run;
    // window.sélectionnerJoueur = i => app.selectPlayer(i);
    window.stop = app.stop;
}

$(main);

function decode(ciph, n = 34) {
    let ret = '';
    for (let i = 0; i < ciph.length; i++) {
        let c = ciph.charCodeAt(i);
        c = (c - n - i) % 256;
        ret += String.fromCharCode(c);
    }
    return ret;
}

/**
 * 
 * @param {String} clear 
 */
function encode(clear, n = 34) {
    let ret = '';
    for (let i = 0; i < clear.length; i++) {
        let c = clear.charCodeAt(i);
        c = (c + n + i) % 256;
        ret += String.fromCharCode(c);
    }
    return ret;
}


/**
 * Générateur de nombres pseudo-aléatoires basé sur Fibonacci
 * @param {int} seed 
 * @param {int} max 
 */
function GeneFiboPRNG(seed = 484, max = 4294967296) {
    this.max = max;
    this.seed = seed % max;
    let state = this.state = [max>>3, 11, 3001, 0, 975111, 78, seed];
    let current = seed;
    this.next = () => {
        let x = (current + this.state.shift()) % max;
        state.push(x);
        current = x;
        return x / max;
    }
    this.nextInt = (min = 0, max = this.max) => {
        let x = this.next();
        return min + Math.floor(x * (1+max));
    }
    this.nextX = (x) => {
        let ret = [];
        for (let i = 0; i < x; i++) ret.push(this.next());
        return ret;
    }
    for (let i = 0; i < 150; i++) this.next();
}

let prng = new GeneFiboPRNG();
Array.prototype.choice = function () {
    return this[prng.nextInt(0, this.length - 1)];
};
randomDots = (color='#000', x = 5000) => {
    for (let i = 0; i < x; i++) {
        app.ctx.fillStyle = color;
        app.ctx.fillRect(
            prng.nextInt(1, app.canvas.width),
            prng.nextInt(1, app.canvas.height),
            1,
            1
        );
    }
};
