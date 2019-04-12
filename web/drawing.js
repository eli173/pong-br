

function drawngon(n,r) {
    var cvs = document.getElementById('game');
    var ctx = cvs.getContext('2d');
    var angleper = 2*Math.PI/n;
    var center = {x:cvs.width/2, y:cvs.height/2};

    ctx.beginPath();
    ctx.moveTo(center.x+r, center.y);
    var start = {x: center.x+r, y:center.y};
    for(var i=1; i<n; i++) {
	var next = rotate(start, center, angleper*i);
	ctx.lineTo(next.x, next.y);
    }
    ctx.closePath();
    ctx.stroke();
}


function rotate(p,c,t) {
    // rotates p around c by t
    var d = {x:p.x-c.x, y:p.y-c.y};
    var r = {x:d.x*Math.cos(t)-d.y*Math.sin(t), y:d.x*Math.sin(t)+d.y*Math.cos(t)};
    var f = {x:r.x+c.x, y:r.y+c.y};
    return f;
}
