var canvas = document.getElementById('editor');
var ctx = canvas.getContext('2d');

for (var x = 0; x < canvas.width; x += 64) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
}

for (var y = 0; y < canvas.height; y += 64) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
}

ctx.stroke();

document.addEventListener('mousedown', function(e) {
    ctx.fillRect(Math.floor(e.x/64)*64, Math.floor(e.y/64)*64, 64, 64);
});
