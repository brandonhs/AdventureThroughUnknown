class GameAnimation {
    constructor(src, num_frames, fps, sprite_width, sprite_height) {
        this.num_frames = num_frames;
        this.fps = fps;

        this.image = new Image();
        this.image.src = src;

        this.sprite_width = sprite_width;
        this.sprite_height = sprite_height;

        this.frame_no = 0;

        this.isPlaying = false;
        this.animId = null;
    }

    update() {
        if (this.frame_no < this.num_frames - 1) {
            this.frame_no += 1;
        } else {
            this.frame_no = 0;
        }
    }

    drawCurrentFrame(ctx, x, y) {
        ctx.drawImage(this.image, this.sprite_width*this.frame_no, 0, this.sprite_width, this.sprite_height, x, y, this.sprite_width, this.sprite_height);
    }
}

var KeyInputEvents = {
    keysPressed: [],
    keyReleased: Number,

    init: function() {
        document.addEventListener('keydown', function(e) {
            KeyInputEvents.keysPressed[e.keyCode] = true;
        });
        document.addEventListener('keyup', function(e) {
            KeyInputEvents.keysPressed[e.keyCode] = false;
            KeyInputEvents.keyReleased = e.keyCode;
        });
    }
}

var Player = {
    x: 0,
    y: 100,

    move_speed: 4,

    vel: {
        x: 0,
        y: 0
    },

    animations: {
        idle: null,
        walk: {
            right: null,
            left: null
        }
    },

    width: null,
    height: null,

    animId: null,

    start: true,

    idleCanPlay: true,

    init: function() {
        Player.animations.idle = new GameAnimation('src/anim/PlayerAnimationIdle.png', 8, 2, 64, 64);
        Player.animations.walk.right = new GameAnimation('src/anim/PlayerAnimationWalkRight.png', 1, 2, 64, 64);
        Player.animations.walk.left = new GameAnimation('src/anim/PlayerAnimationWalkLeft.png', 1, 2, 64, 64);

        Player.animations.idle.animId = setInterval(function() {
            if (Player.animations.idle.isPlaying) {
                Player.animations.idle.update();
            }
        }, 1000/Player.animations.idle.fps);
        Player.animations.walk.right.animId = setInterval(function() {
            if (Player.animations.walk.right.isPlaying) {
                Player.animations.walk.right.update();
            }
        }, 1000/Player.animations.walk.right.fps);
    },

    update: function() {
        // Input
        if (KeyInputEvents.keysPressed[37]) {
            Player.vel.x = -Player.move_speed;
        } else if (KeyInputEvents.keyReleased == 37) {
            Player.vel.x = 0;
            KeyInputEvents.keyReleased = null;
        }

        if (KeyInputEvents.keysPressed[39]) {
            Player.vel.x = Player.move_speed;
        } else if (KeyInputEvents.keyReleased == 39) {
            Player.vel.x = 0;
            KeyInputEvents.keyReleased = null;
        }

        // Movement Update
        Player.x += Player.vel.x;
        Player.y -= Player.vel.y;

        // Animations
        if (Player.vel.x > 0) {
            Player.animations.idle.isPlaying = false;
            Player.animations.walk.right.isPlaying = true;
            Player.animations.walk.left.isPlaying = false;

            Player.animations.walk.right.drawCurrentFrame(Game.ctx, Player.x, Player.y);
        } else if (Player.vel.x < 0) {
            Player.animations.idle.isPlaying = false;
            Player.animations.walk.right.isPlaying = false;
            Player.animations.walk.left.isPlaying = true;

            Player.animations.walk.left.drawCurrentFrame(Game.ctx, Player.x, Player.y);
        } else {
            Player.animations.idle.isPlaying = true;
            Player.animations.walk.right.isPlaying = false;
            Player.animations.walk.left.isPlaying = false;

            Player.animations.idle.drawCurrentFrame(Game.ctx, Player.x, Player.y);
        }
    }
}

var Game = {
    canvas: null,
    ctx: null,

    init: function() {
    },

    start: function() {
        Game.canvas = document.getElementById('game_screen');
        Game.ctx = Game.canvas.getContext('2d');

        Player.init();

        KeyInputEvents.init();

        Game.loop();
    },

    loop: function() {
        requestAnimationFrame(Game.loop);

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

        Player.update();
    }
}

Game.init();
window.onload = Game.start;
