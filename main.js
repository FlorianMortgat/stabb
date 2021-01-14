let app = {
    init(root) {
        this.root = root;
        this.scene = root.querySelector('.stabb .scene_c');
        this.info = root.querySelector('.stabb .info');
        this.edit = root.querySelector('.stabb .edit');

        this.canvas = document.createElement('canvas');
        this.canvas.width = $('.scene_c').width();
        this.canvas.height = $('.scene_c').height();
        let ctx = this.ctx = this.canvas.getContext('2d');
        $(this.canvas).appendTo($(this.scene));

    },
    clear() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(1, 1, 800, 600);
    },
    main() {
        this.clear();
        this.player.draw();
        this.player.move();
        this.i++;
        if (this.i > 100) {
            window.clearInterval(this.pid);
            console.log('the end');
        }
    },
    run() {
        this.i = 0;
        let running = true;
        let self = this;
        let f = Math.floor;
        this.player = {
            x: 40,
            y: 40,
            w: 10,
            h: 10,
            deltaX: 1,
            deltaY: 0.2,
            color: 'green',
            draw() {
                // console.log(this.x, this.y);
                self.ctx.fillStyle = this.color;
                self.ctx.fillRect(f(this.x - this.w / 2), f(this.y - this.h / 2), this.w, this.h);
            },
            move() {
                this.x += this.deltaX;
                this.y += this.deltaY;
            },
        };
        this.pid = window.setInterval(() => this.main(), 50);
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