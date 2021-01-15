let app = {
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
        this.clear();
        this.players.forEach((p) => {
            p.draw();
            p.move();
        });
        this.i++;
        if (this.i > 1000000) {
            window.clearInterval(this.pid);
            console.log('the end');
            this.clear();
            this.player.draw();
        }
    },
    newPlayer(color = 'green') {
        let self = this;
        return {
            x: self.canvas.width / 2,
            y: self.canvas.height / 2,
            w: 10,
            h: 10,
            targetX: Math.random() * self.canvas.width,
            targetY: Math.random() * self.canvas.height,
            speed: 1.5,
            color: color,
            draw() {
                // console.log(this.x, this.y);
                self.ctx.fillStyle = this.color;
                self.ctx.fillRect(Math.floor(this.x - this.w / 2), Math.floor(this.y - this.h / 2), this.w, this.h);
            },
            move() {
                if (!this.speed) return;
                let deltaX = this.targetX - this.x,
                    deltaY = this.targetY - this.y,
                    distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                    speedX,
                    speedY;
                if (distance < this.speed) {
                    speedX = deltaX;
                    speedY = deltaY;
                } else {
                    speedX = deltaX * this.speed / distance;
                    speedY = deltaY * this.speed / distance;
                }
                this.x += speedX;
                this.y += speedY;
            },
            destination(x, y) {
                this.targetX = x;
                this.targetY = y;
            },
            téléporter(x, y) {
                this.x = x;
                this.y = y;
            },
        };
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
            this.newPlayer('green'),
            this.newPlayer('red'),
            this.newPlayer('blue'),
        ];
        this.selectPlayer(0);
        this.pid = window.setInterval(() => this.main(), 25);
    },
    stop() {
        window.clearInterval(this.pid);
    },
};

function main() {
    app.init(document.body);
    app.run();
    window.sélectionnerJoueur = i => app.selectPlayer(i);
    // 1) construction interface de base
    // 2) composant canvas
    // 3) modulaire?? non, au début je code tout en dur.
}

$(main);