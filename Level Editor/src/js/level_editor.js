var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

if (typeof localStorage.levels == 'undefined') {
    console.log("First time.");
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

const images = [
    new GameImage("../src/img/tile_grass.png"),
    new GameImage("../src/img/tile_dirt.png"),
    new GameImage("../src/img/tile_rock.png"),
    new GameImage("../src/img/tile_level_complete.png"),
    new GameImage("../src/img/tile_level_start.png"),
    new GameImage("../src/img/tile_coin.png"),
    new GameImage("../src/img/tile_kill_zone.png")
];

var mouse = {
    x: 0,
    y: 0,
    down: false,
    erasing: false,

    oncanvas: false,

    last_move: {
        x: 0,
        y: 0
    }
};

var current_image = 1;

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 69) {
        mouse.erasing = true;
    }
    if (e.keyCode == 49) {
        current_image = 1;
    }
    if (e.keyCode == 50) {
        current_image = 2;
    }
    if (e.keyCode == 51) {
        current_image = 3;
    }
    if (e.keyCode == 52) {
        current_image = 4;
    }
    if (e.keyCode == 53) {
        current_image = 5;
    }
    if (e.keyCode == 54) {
        current_image = 6;
    }
    if (e.keyCode == 55) {
        current_image = 7;
    }
    if (e.keyCode == 48) {
        current_image = -1;
    }
    if (e.keyCode == 37) {
        localStorage.clear();
        console.log("cleared");
    }
});

document.addEventListener('keyup', function(e) {
    if (e.keyCode == 69) {
        mouse.erasing = false;
    }
});

canvas.addEventListener('mousedown', function() {
    mouse.down = true;
});

canvas.addEventListener('mouseup', function() {
    mouse.down = false;
});

canvas.addEventListener('mousemove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

canvas.addEventListener('mouseover', function() {
    mouse.oncanvas = true;
});

canvas.addEventListener('mouseout', function() {
    mouse.oncanvas = false;
});

function createMovingPlatform(x, y, offsetX, offsetY, speedX, speedY, id, image, axis) {
    level.data[y][x] = "{offset: {x: " + offsetX + ", y: " + offsetY + "}, speed: {x: " + speedX + ", y: " + speedY  + "}, id: " + id  + ", image: " + image + ", axis: " + axis + "}";
}

function submit() {
    var output = document.getElementById("output");
    output.value = "";
    for (var y = 0; y < level.data.length; y++) {
        for (var x = 0; x < level.data[0].length; x++) {
            if (x == 0) {
                output.value += "   [";
            }
            output.value += level.data[y][x];
            if (x != level.data[0].length - 1) {
                output.value += ", "
            } else {
                output.value += "],\n";
            }
        }
    }
    output.select();

    document.execCommand("copy");

    var a = [];
    a.push(localStorage.levels);
    a.push(level.data);
    localStorage.setItem("levels", JSON.stringify(a));
}

function load() {
    var input = document.getElementById("input");
    level.data = JSON.parse(localStorage.levels)[parseInt(input.value)];
    console.log(level.data);
}

function makeEmptyLevel(width, height, val) {
    var temp = [];
    for (var i = 0; i < height; i++) {
        temp[i] = [];
        for (var j = 0; j < width; j++) {
            temp[i][j] = val;
        }
    }
    return temp;
}

var levels = [];

var level = {
    data: makeEmptyLevel(15, 9, 0)
};

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgb(0, 0, 0)";
    for (var x = 0; x < canvas.width; x += 64) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += 64) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    if (mouse.down) {
        if (mouse.erasing) {
            level.data[Math.floor(mouse.y/64)][Math.floor(mouse.x/64)] = 0;
        } else if (current_image != -1) {
            level.data[Math.floor(mouse.y/64)][Math.floor(mouse.x/64)] = current_image;
            mouse.last_move = {
                x: Math.floor(mouse.y/64),
                y: Math.floor(mouse.x/64)
            }
        }
    }

    for (var y = 0; y < level.data.length; y++) {
        for (var x = 0; x < level.data[0].length; x++) {
            if (typeof level.data[y][x] == 'string') {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                } else {
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                }

                ctx.fillRect(x*64, y*64, 64, 64);
            }
            else if (level.data[y][x] == 1) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[0].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 2) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[1].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 3) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[2].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 4) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[3].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 5) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[4].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 6) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[5].draw(ctx, x*64, y*64);
                }
            } else if (level.data[y][x] == 7) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                    ctx.fillRect(x*64, y*64, 64, 64);
                } else {
                    images[6].draw(ctx, x*64, y*64);
                }
            }
        }
    }

    if (mouse.erasing) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
        ctx.fillRect(Math.floor(mouse.x/64)*64, Math.floor(mouse.y/64)*64, 64, 64);
    } else if (current_image != -1 && mouse.oncanvas) {
        images[current_image-1].draw(ctx, Math.floor(mouse.x/64)*64, Math.floor(mouse.y/64)*64);
    }
}

window.onload = loop();
