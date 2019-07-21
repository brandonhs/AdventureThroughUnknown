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

    play() {
        if (this.frame_no < this.num_frames - 1) {
            this.frame_no += 1;
        } else {
            this.frame_no = 0;
        }
    }

    update() {
        if (!this.isPlaying) {
            this.frame_no = 0;
        }
    }

    drawCurrentFrame(ctx, x, y) {
        ctx.drawImage(this.image, this.sprite_width*this.frame_no, 0, this.sprite_width, this.sprite_height, x, y, this.sprite_width, this.sprite_height);
    }
}

class GameImage {
    /**
     * @param {String} src 
     */
    constructor(src) {
        this.img = new Image();
        this.img.src = src;
    }
    /**
     * @param {CanvasRenderingContext2D} ctx 
     * @param {Number} x 
     * @param {Number} y 
     */
    draw(ctx, x, y) {
        ctx.drawImage(this.img, x, y);
    }
}

class GameObject {
    /**
     * @param {Number} x 
     * @param {Number} y
     * @param {Number} width
     * @param {Number} heigth
     * @param {GameImage} img
     * @param {String} tag
     */
    constructor(x, y, width, height, img, tag) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.tag = tag;

        this.img = null;

        if (img != undefined) {
            this.img = img;
        }
    }

    draw(ctx) {
        if (this.img != null) {
            this.img.draw(ctx, this.x, this.y)
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
}

class Level {
    /**
     * @param {[][]} data
     * @param {Number} id
     */
    constructor(data, id) {
        this.data = data;
        this.width = data.length;
        this.height = data[0].length;
        this.id = id;
    }

    /**
     * returns a game object
     * @returns {GameObject} gameObject
     */
    out(x, y) {
        return this.data[x][y];
    }
}

var Camera = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,

    speedX: 0,

    follow_player: false,

    isScrolling: false,

    init() {
        this.width = Game.canvas.width;
        this.height = Game.canvas.height;

        if (this.follow_player) {
            this.isScrolling = true;
        }
    },

    scroll(dx) {
        this.speedX = dx;
    },

    stop() {
        this.speedX = 0;
    },

    update() {
        Player.x -= this.speedX;

        for (var i = 0; i < Game.walls.length; i++) {
            Game.walls[i].x -= this.speedX;
        }
    }
};

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
    y: 0,

    spawnX: 0,
    spawnY: 0,

    renderX: 0,
    renderY: 0,

    gravity_force: 0.35,
    max_gravity_speed: 25,

    isJumping: false,
    isGrounded: false,
    canJump: false,
    isDead: false,

    move_speed: {
        x: 4,
        y: 11.75
    },

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

    width: 64,
    height: 64,

    animId: null,

    canComplete: true,

    start: true,

    idleCanPlay: true,

    init: function() {
        if (!Game.first_load) {
            clearInterval(Player.animations.idle.animId);
            clearInterval(Player.animations.walk.right.animId);
            clearInterval(Player.animations.walk.left.animId);
        }

        Player.x = Player.spawnX;
        Player.y = Player.spawnY;

        Player.animations.idle = new GameAnimation('src/anim/PlayerAnimationIdle.png', 8, 1.5, Player.width, Player.height);
        Player.animations.walk.right = new GameAnimation('src/anim/PlayerAnimationWalkRight.png', 1, 2, Player.width, Player.height);
        Player.animations.walk.left = new GameAnimation('src/anim/PlayerAnimationWalkLeft.png', 1, 2, Player.width, Player.height);

        Player.animations.idle.animId = setInterval(function() {
            Player.animations.idle.update();
            if (Player.animations.idle.isPlaying) {
                Player.animations.idle.play();
            }
        }, 1000/Player.animations.idle.fps);
        Player.animations.walk.right.animId = setInterval(function() {
            Player.animations.walk.right.update();
            if (Player.animations.walk.right.isPlaying) {
                Player.animations.walk.right.play();
            }
        }, 1000/Player.animations.walk.right.fps);
        Player.animations.walk.left.animId = setInterval(function() {
            Player.animations.walk.left.update();
            if (Player.animations.walk.left.isPlaying) {
                Player.animations.walk.left.play();
            }
        }, 1000/Player.animations.walk.left.fps);
    },

    reInit: function() {
        Player.x = Player.spawnX;
        Player.y = Player.spawnY;
        Player.isJumping = false;
        Player.canJump = false;
        Player.isGrounded = false;
        Player.isDead = false;
        Player.vel.y = 0;
    },

    update: function() {
        if (Player.y > Game.canvas.height) {
            Player.isDead = true;
        }
        // Input
        if (KeyInputEvents.keysPressed[37]) {
            Player.vel.x = -Player.move_speed.x;
        } else if (KeyInputEvents.keyReleased == 37) {
            Player.vel.x = 0;
            KeyInputEvents.keyReleased = null;
        }

        if (KeyInputEvents.keysPressed[39]) {
            Player.vel.x = Player.move_speed.x;
        } else if (KeyInputEvents.keyReleased == 39) {
            Player.vel.x = 0;
            KeyInputEvents.keyReleased = null;
        }

        Player.vel.y += Player.gravity_force;
        if (Player.vel.y > Player.max_gravity_speed) {
            Player.vel.y = Player.max_gravity_speed;
        }

        if (KeyInputEvents.keysPressed[38] && Player.canJump) {
            Player.canJump = false;
            Player.isGrounded = false;
            Player.isJumping = true;
            Player.vel.y = -Player.move_speed.y;
        }

        if (!KeyInputEvents.keysPressed[38]) {
            if (Player.isGrounded) {
                Player.canJump = true;
            } else if (Player.vel.y < 0) {
                // TODO jump stops abruptly fix this
                //! Player.isJumping = false;
            }
        }

        if (KeyInputEvents.keyReleased == 38) {
            KeyInputEvents.keyReleased = null;
        }

        if (Player.vel.x > 0 && !KeyInputEvents.keysPressed[39]) {
            Player.vel.x = 0;
        }

        if (Player.vel.x < 0 && !KeyInputEvents.keysPressed[37]) {
            Player.vel.x = 0;
        }

        // Movement Update
        Player.x += Player.vel.x;
        Player.y += Player.vel.y;

        for (var i = 0; i < Game.walls.length; i++) {
            if (Player.handleCollision(Game.walls[i])) {
                if (Game.walls[i].tag == "Level Complete" && Player.canComplete) {
                    if (Game.load_next_level() != null) {
                        Player.canComplete = false;
                        return;
                    }
                }
            } else {
                
            }
        }

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
    },

    /**
     * returns true if collision with other is detected
     * @param {GameObject} other 
     */
    handleCollision: function(other) {
        // left
        if (Player.x + Player.width > other.x && Player.y + Player.height > other.y && Player.y + 24 < other.y + other.height && Player.x + Player.width < other.x + 5) {
            Player.x = other.x - Player.width;
            return true;
        }

        // right
        else if (Player.x < other.x + other.width && Player.y + Player.height > other.y + 1 && Player.y + 24 < other.y + other.height && Player.x > other.x + other.width - 5)  {
            Player.x = other.x + other.width;
            return true;
        }

        // top
        else if (Player.y + Player.height > other.y && Player.x + Player.width > other.x && Player.x < other.x + other.width && Player.y + 24 < other.y) {
            Player.y = other.y - Player.height;
            Player.vel.y = 0;
            Player.isJumping = false;
            Player.isGrounded = true;
            return true;
        }

        // bottom
        else if (Player.y + 24 < other.y + other.height && Player.x + Player.width > other.x && Player.x < other.x + other.width && Player.y + Player.height > other.y + other.height) {
            Player.y = other.y + other.height - 24;
            Player.isJumping = false;
            Player.vel.y = 0;
            return true;
        }
    }
}


// TODO split "walls" into different variables
var Game = {
    canvas: null,
    ctx: null,

    first_load: true,

    tile_width: 64,
    tile_height: 64,

    images: [
        new GameImage("src/img/tile_grass.png"),
        new GameImage("src/img/tile_dirt.png"),
        new GameImage("src/img/tile_rock.png"),
        new GameImage("src/img/tile_level_complete.png"),
        new GameImage("src/img/tile_level_start.png")
    ],

    levels: [],
    current_level: 0,

    walls: [],

    restart: function() {
        Game.first_load = false;
        Player.reInit();
    },

    init: function() {
        window.onload = Game.start;
    },

    start: function() {
        Game.canvas = document.getElementById('game_screen');
        Game.ctx = Game.canvas.getContext('2d');

        Game.levels.push(new Level([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 4],
            [0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 2],
            [0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 3, 0, 0, 3],
            [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3],
            [0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 3, 3, 0, 0, 3],
            [5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        ], 0));

        Game.levels.push(new Level([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 3, 3, 0, 0, 0, 3, 3, 0, 0, 0, 4],
            [5, 3, 3, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3, 3, 1],                         
        ], 1));

        Game.levels.push(new Level([
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3],
            [3, 3, 0, 0, 0, 3, 0, 0, 3, 0, 0, 0, 0, 3, 3],
            [0, 0, 0, 0, 0, 3, 0, 5, 3, 0, 0, 0, 3, 3, 3],
            [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 3, 3, 3],
            [0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],         
        ], 2));

        Game.load_next_level();

        Player.init();

        KeyInputEvents.init();

        Game.loop();
    },

    load_next_level: function() {
        if (Game.current_level == Game.levels.length)
            return null;
        Game.walls = [];
        for (var y = 0; y < Game.levels[Game.current_level].data.length; y++) {
            for (var x = 0; x < Game.levels[Game.current_level].data[Game.current_level].length; x++) {
                if (Game.levels[Game.current_level].data[y][x] == 1) {
                    Game.walls.push(new GameObject(x*Game.tile_width, y*Game.tile_height, Game.tile_width, Game.tile_height, Game.images[0]));
                }
                if (Game.levels[Game.current_level].data[y][x] == 2) {
                    Game.walls.push(new GameObject(x*Game.tile_width, y*Game.tile_height, Game.tile_width, Game.tile_height, Game.images[1]));
                }
                if (Game.levels[Game.current_level].data[y][x] == 3) {
                    Game.walls.push(new GameObject(x*Game.tile_width, y*Game.tile_height, Game.tile_width, Game.tile_height, Game.images[2]));
                }
                if (Game.levels[Game.current_level].data[y][x] == 4) {
                    Game.walls.push(new GameObject(x*Game.tile_width, y*Game.tile_height, Game.tile_width, Game.tile_height, Game.images[3], "Level Complete"));
                }
                if (Game.levels[Game.current_level].data[y][x] == 5) {
                    Game.walls.push(new GameObject(x*Game.tile_width, y*Game.tile_height, Game.tile_width, Game.tile_height, Game.images[4]));
                    Player.spawnX = x*Game.tile_width;
                    Player.spawnY = y*Game.tile_height - Player.height;
                }
            }
        }

        Player.reInit();

        Game.current_level += 1;
    },

    loop: function() {
        if (Player.isDead) {
            Game.restart();
        }

        requestAnimationFrame(Game.loop);

        Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);

        Player.update();

        for (var i = 0; i < Game.walls.length; i++) {
            Game.walls[i].draw(Game.ctx);
        }

        Player.canComplete = true;
    }
}

Game.init();
