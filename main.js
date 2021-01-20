class Player {
    constructor(app, png, x, y, targetX, targetY, speed = 1) {
        this.png = png;
        this.ready = false;
        this.app = app
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.speed = speed;
        this.direction = 'w';

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
                idle: 0
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
        if (dist > 0) {
            if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                // East or West?
                this.direction = (deltaX > 0) ? 'e' : 'w';
            } else {
                // North or South?
                this.direction = (deltaY < 0) ? 'n' : 's';
            } 
        } else {
            this.direction = 'idle';
        }
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
}

let distance = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));


let app = {
    refreshRate: 25,
    init(root) {
        this.root = root;
        this.scene = root.querySelector('.stabb .scene_c');
        this.info = root.querySelector('.stabb .info');
        this.edit = root.querySelector('.stabb .edit');

        this.canvas = document.createElement('canvas');
        this.canvas.addEventListener('mousedown', e => {
            let x = e.clientX - this.rect.left;
            let y = e.clientY - this.rect.top;
            if (e.button === 0) this.leftclick(x, y);
            else if (e.button === 2) this.rightclick(x, y);
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
    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(1, 1, this.canvas.width, this.canvas.height);
    },
    leftclick(x, y) {
        this.player.destination(x, y);
    },
    rightclick(x, y) {
        this.player.téléporter(x, y);
    },
    main() {
        let now = Date.now();
        this.clear();
        this.players.forEach((p) => {
            p.update(now);
            p.draw(this.ctx);
        });
        this.i++;
        if (this.i > 10000000) {
            window.clearInterval(this.pid);
            console.log('the end');
            this.clear();
        }
    },
    selectPlayer(i) {
        return this.player = window.joueur = this.players[i % this.players.length];
    },
    // TODO: détection des collisions / des distances pour permettre interactions entre objets
    // TODO: passer les noms de variables exposées en français ☺
    run() {
        this.i = 0;
        let running = true;
        let self = this;
        this.players = window.players = [
            new Player(this, 'hero.png', self.canvas.width / 2, self.canvas.height / 2, Math.random() * self.canvas.width, Math.random() * self.canvas.height, 2),
            new Player(this, 'ennemy.png', self.canvas.width / 2, self.canvas.height / 2, Math.random() * self.canvas.width, Math.random() * self.canvas.height, 1.5),
            new Player(this, 'ennemy.png', self.canvas.width / 2, self.canvas.height / 2, Math.random() * self.canvas.width, Math.random() * self.canvas.height),
            //this.newPlayer('green'),
            //this.newPlayer('red'),
            //this.newPlayer('blue'),
        ];
        this.selectPlayer(0);
        this.pid = window.setInterval(() => this.main(), this.refreshRate);
    },
    stop() {
        window.clearInterval(this.pid);
    },
};

function main() {
    app.init(document.body);
    app.run();
    window.sélectionnerJoueur = i => app.selectPlayer(i);
}

$(main);



window.levels = [

];