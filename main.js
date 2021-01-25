/**
 Github: https://github.com/FlorianMortgat/stabb
 */

// TODO:
//  - créer une classe Animation distincte de la classe Player
//  - créer une classe Drawable qui sera le parent de Player et StaticObject
//  - renommer Player en Character
//  - créer une classe Collidable pour paramétrer les primitives
//  - faire en sorte de pouvoir fuir (pour l'instant, en cas de collision
//    avec un ennemi, un personnage ne peut pas bouger tant que l'ennemi est
//    vivant.

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
        this.app.checkReady();
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
        if (!this.ready) {
            throw 'uninitialized image';
        }
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
        this.app.checkReady();
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

/**
 * @var {Object} window.$
 */

window.app = {
    refreshInterval: 25,
    assetDir: 'assets',
    ready: false,
    stopped: true,
    onready: () => {},
    setReady() { return this.ready = true; },
    /**
     * Vérifie que toutes les ressources (images, niveaux) sont chargées avant
     * de démarrer des actions qui nécessitent ces ressources.
     */
    checkReady() {
        this.levels
            && this.levels.ready
            && this.drawable
            && this.drawable.every((o) => o.ready)
            && this.setReady()
            && this.onready();
    },
    installLevel(level) {
        this.level = level;
        this.level.initLevel(this);
    },
    init(root) {
        this.root = root;
        this.maxUpdates = 60 * 15 * Math.floor(1000 / this.refreshInterval),
        this.scene = root.querySelector('.stabb .scene_c');
        this.info = root.querySelector('.stabb .info_level');
        this.gamelog = root.querySelector('.stabb .game_log');
        this.level = window.level = {};

        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('mousedown', e => {
            let x = e.clientX - this.rect.left;
            let y = e.clientY - this.rect.top;
            if (e.button === 0) {
                // left mouse button
                if (this.level.leftclick) {
                    this.level.leftclick({x: x, y: y});
                } else if (this.gestionnaireClic) {
                    this.gestionnaireClic({x: x, y: y});
                }
            } else if (e.button === 2) {
                if (this.level.rightclick) {
                    this.level.rightclick({x: x, y: y});
                }
            }
        });
        this.ctx = this.canvas.getContext('2d');
        this.initCanvasSize();
        // window.addEventListener('resize', () => {
        //     // this.initCanvasSize();
        // });
        // empêcher le clic droit d'ouvrir le menu contextuel sur le canvas.
        this.canvas.addEventListener(
            'contextmenu',
            (ev) => {
            ev.preventDefault();
            return false;
        });
        $(this.canvas).appendTo($(this.scene));

        $.get('interface.php?get=levels', (data) => {
            this.levels = data.payload;
            this.currentLevel = 0;
            this.loadLevel(0);
        });
    },
    loadLevel(index = 0) {
        if (!this.stopped) this.stop();
        $.get('interface.php?get=' + this.levels[index], (data) => {
            let html = window.markdownConverter.makeHtml(data.payload.text);
            $('.stabb .info_level > div').html(html);
            if (data.payload.js) {
                let scriptTag = document.createElement('script');
                scriptTag.type = 'application/javascript';
                scriptTag.src = data.payload.js;
                document.body.appendChild(scriptTag);
            }
        });


        document.querySelector('#stabb button').removeAttribute('disabled');

        if (this.currentLevel === this.levels.length -1) {
            document.querySelector('#stabb button.next').setAttribute('disabled', true);
        }

        if (this.currentLevel === 0) {
            document.querySelector('#stabb button.prev').setAttribute('disabled', true);
        }
    },
    nextLevel() {
        this.currentLevel = Math.min(this.levels.length, this.currentLevel + 1);
        this.loadLevel(this.currentLevel);
    },
    prevLevel() {
        this.currentLevel = Math.max(0, this.currentLevel - 1);
        this.loadLevel(this.currentLevel);
    },
    setLevelCompleted() {
        this.levels[this.currentLevel].completed = true;
        if (this.currentLevel < this.levels.length -1) {
            document.querySelector('#stabb button.next').removeAttribute('disabled');
        }
    },
    initCanvasSize() {
        // if (this.stopped) return;
        // this.canvas.width = $('.scene_c').width();
        // this.canvas.height = $('.scene_c').height();
        this.canvas.width = 700;
        this.canvas.height = 525;
        this.rect = this.canvas.getBoundingClientRect();
    },
    clear(color) {
        if (color === undefined) color = this.ctx.fillStyle;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //randomDots('#353535', 1000);
    },
    /**
     * Fonction "boucle principale" qui est appelée toutes les 25 millisecondes
     * (intervalle configurable avec this.refreshInterval).
     */
    update() {
        if (!this.ready) throw 'update while not ready';
        this.ctx.fillStyle = '#222';
        let now = Date.now(); // TODO: se débarrasser du now (toutes les durées seront calculées
                              //       en fonction de this.refreshRate)
        this.clear();
        // randomDots('#232', 5000, 2);
        this.detectEnnemyCollisions();
        
        // hook pour les niveaux
        this.level.update(this);

        // make all characters move
        this.characters.forEach((p) => p.update(now));

        // draw all drawable objects
        this.drawable.forEach((o) => o.draw(this.ctx));

        if (this.i++ > this.maxUpdates) {
            // pour soulager le CPU si on n'est pas sur le jeu
            this.finish('Fini (délai maximum dépassé)');
        }
    },

    setupLevel() {
        this.i = 0;

        let endDiv = document.querySelector('#stabb .finish_msg');
        endDiv.innerText = '';
        endDiv.classList.remove('visible');

        window.joueur = this.protagonist = new Player(
            this,
            this.assetDir + '/hero.png',
            this.canvas.width / 2,
            this.canvas.height / 2,
            this.canvas.width / 2,
            this.canvas.height / 2,
            2,
            'Héros'
        );

        this.ennemies = [];
        this.drawable = [];

        // characters = protagonist + ennemies
        this.characters = window.characters = [];

        this.level.setupLevel(this);

        this.characters.push(...this.ennemies);
        this.characters.push(this.protagonist);
        this.drawable.push(...this.characters);
        // first update to show the "paused" game (once the assets are loaded)
        this.onready = () => this.update();
    },

    // TODO: passer les noms de variables exposées en français ☺
    run() {
        this.stopped = false;
        this.pid = window.setInterval(() => this.update(), this.refreshInterval);
    },
    hasCollision(a, b) {
        return distance(a.x, a.y, b.x, b.y)
               <
               a.width / 2 - a.spriteMargin + b.width / 2 - b.spriteMargin;
    },
    detectEnnemyCollisions() {
        this.protagonist.isInCollision = false;
        let nbAttacksInTurn = 0; // player can attack only once in this loop
        this.ennemies.forEach((e) => {
            if (!e.alive()) return;
            e.isInCollision = false;
            if (this.hasCollision(this.protagonist, e)) {
                this.protagonist.isInCollision = true;
                e.isInCollision = true;
                if (this.i % 15 === 0) {
                    if (!nbAttacksInTurn++) {
                        this.protagonist.attackOther(e);
                    }
                    e.attackOther(this.protagonist);
                }
            }
        });
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
    finish(message) {
        let endDiv = document.querySelector('#stabb .finish_msg');
        endDiv.innerText = message;
        endDiv.classList.add('visible');
        this.stop();
    },

    log(msg) {

    },
};

function main() {
    window.markdownConverter = new showdown.Converter();
    app.init(document.body);
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
randomDots = (color='#000', x = 5000, size = 1) => {
    for (let i = 0; i < x; i++) {
        app.ctx.fillStyle = color;
        app.ctx.fillRect(
            prng.nextInt(1, app.canvas.width),
            prng.nextInt(1, app.canvas.height),
            size,
            size
        );
    }
};
