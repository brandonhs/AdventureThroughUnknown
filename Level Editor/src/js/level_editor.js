var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

var mouse = {
    x: 0,
    y: 0,
    down: false,
    erasing: false,

    last_move: {
        x: 0,
        y: 0
    }
};

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 69) {
        mouse.erasing = true;
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


canvas.addEventListener('touchstart', function() {
    mouse.down = true;
});

canvas.addEventListener('touchend', function() {
    mouse.down = false;
});

canvas.addEventListener('touchmove', function(e) {
    mouse.x = e.x;
    mouse.y = e.y;
});

function submit() {
    var output = document.getElementById("output");
    output.value = "level = [\n";
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
    output.value += "];"
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

var level = {
    data: makeEmptyLevel(15, 9, 0)
};

function loop() {
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgb(0, 0, 0)"
    for (var x = 0; x < canvas.width; x += 64) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }
    for (var y = 0; y < canvas.height; y += 64) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    if (mouse.erasing) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
    } else {
        ctx.fillStyle = "rgba(1, 1, 1, 0.1)";
    }
    ctx.fillRect(Math.floor(mouse.x/64)*64, Math.floor(mouse.y/64)*64, 64, 64);

    if (mouse.down) {
        if (mouse.erasing) {
            level.data[Math.floor(mouse.y/64)][Math.floor(mouse.x/64)] = 0;
        } else {
            level.data[Math.floor(mouse.y/64)][Math.floor(mouse.x/64)] = 1;
            mouse.last_move = {
                x: Math.floor(mouse.y/64),
                y: Math.floor(mouse.x/64)
            }
        }
    }

    for (var y = 0; y < level.data.length; y++) {
        for (var x = 0; x < level.data[0].length; x++) {
            if (level.data[y][x] == 1) {
                if (mouse.erasing && Math.floor(mouse.y/64) == y && Math.floor(mouse.x/64) == x) {
                    ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
                } else {
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                }
                ctx.fillRect(x*64, y*64, 64, 64);
            }
        }
    }
}

loop();
