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
        this.player.retarget(x, y);
    },
    rightclick(x, y) {
        this.player.teleport(x, y);
    },
    main() {
        this.clear();
        this.player.draw();
        this.player.move();
        this.i++;
        if (this.i > 1000000) {
            window.clearInterval(this.pid);
            console.log('the end');
            this.clear();
            this.player.draw();
        }
    },
    run() {
        this.i = 0;
        let running = true;
        let self = this;
        let f = Math.floor;
        this.player = window.player = {
            x: 40,
            y: 40,
            w: 10,
            h: 10,
            targetX: Math.random() * this.canvas.width,
            targetY: Math.random() * this.canvas.height,
            speed: 1.5,
            color: 'green',
            draw() {
                // console.log(this.x, this.y);
                self.ctx.fillStyle = this.color;
                self.ctx.fillRect(f(this.x - this.w / 2), f(this.y - this.h / 2), this.w, this.h);
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
            retarget(x, y) {
                this.targetX = x;
                this.targetY = y;
            },
            teleport(x, y) {
                this.x = x;
                this.y = y;
            },
        };
        this.pid = window.setInterval(() => this.main(), 25);
    },

};

function main() {
    app.init(document.body);
    app.run();
    // 1) construction interface de base
    // 2) composant canvas
    // 3) modulaire?? non, au début je code tout en dur.
}

$(main);