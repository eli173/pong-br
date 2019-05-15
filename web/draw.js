

// contains the routines needed to actually get the stuff drawn

dwallcolor = 'rgb(200,0,0)';
wallcolor = 'rgb(100,100,0)';
pcolor = 'rgb(0,0,200)';
bcolor = 'rgb(100,100,100)';
xcolor = 'rgb(200,0,200)';
playercolor = 'rgb(0,100,200)';


var latest_theta = 0;

// main function, given everything from the game state, draws on the given context
var draw = function(state, ctx) {
    clearCanvas(ctx);

    // okay, gotta get the endpoints, then draw the walls,
    // then draw the balls,
    // then finally the hard part is the paddles

    var endpoints = genAllEndpoints(state.n, state.dead);

    // set rotation
    // check for dead first
    var isDead = state.dead.some(d => d.id==state.id);
    if(!isDead) {
	var rot_ep = endpoints.find(e => e.id == state.id); // has to have smth right? yeah if alive i guess?
	var rot_mp = new Coord((rot_ep.f.x+rot_ep.s.x)/2, (rot_ep.f.y+rot_ep.s.y)/2);
	var rot_th = Math.atan2(rot_mp.y, rot_mp.x) + Math.PI;
	latest_theta = rot_th;
    }
    ctx.transform(Math.cos(latest_theta),-Math.sin(latest_theta),Math.sin(latest_theta),Math.cos(latest_theta),0,0) // this is to rotate it so that the player paddle is in the right place

    var livingzones = endpoints.filter(e => (e.id != -1) && (!state.dead.some(d=>(d.id==e.id))));
    var walls = endpoints.filter(e => (e.id==-1) || state.dead.some(d=>(d.id==e.id)));
    //draw walls
    for(var eps of walls) {
	var c = wallcolor;
	if(eps.id != -1) {
	    c = dwallcolor;
	}
	drawLine(ctx, c, eps.f, eps.s);
    }
    // do something to show the zones for my sanity
    for(var lz of livingzones) {
	drawLine(ctx, xcolor, lz.f, lz.s);
    }
    // balls
    for(var b of state.balls) {
	drawBall(ctx, bcolor, b, state.dead.length, state.n);
    }
    // finally the paddles...
    for(var eps of livingzones) {
	var paddle = state.paddles.find(p => (p.id==eps.id)); //should be guaranteed?
	if(paddle === undefined) alert("UH OH, paddle somehow undefined");
	// cool this is way simpler since we know these are all alive
	var pps = getPaddlePoints(paddle, eps);
	drawLine(ctx, pcolor, pps.f, pps.s);
    }
    if(isDead) {
	drawOverlay(ctx, state.dead.find(d => d.id == state.id).place);
    }
}


var getPaddlePoints = function(paddle, enclosing) {
    var encl_len = dist(enclosing.f, enclosing.s);
    var pspace_len = encl_len - c.WIDTH_RATIO*encl_len;
    var idk_len = (encl_len - pspace_len)/2; // the length between the highest paddle center location and the edge
    var paddle_ratio = (paddle.pos+1)/2; // converts the -1-to-1-centered 'position' to a 0-1 ratio
    var center_pos = idk_len + paddle_ratio*pspace_len; // length from one of the endpoints (which one? does it matter?)
    var fst_pos = center_pos - c.WIDTH_RATIO*encl_len/2;
    var snd_pos = center_pos + c.WIDTH_RATIO*encl_len/2;
    var fst_pct = fst_pos/encl_len;
    var snd_pct = snd_pos/encl_len;
    var fst_x = enclosing.f.x*fst_pct + enclosing.s.x*(1-fst_pct);
    var fst_y = enclosing.f.y*fst_pct + enclosing.s.y*(1-fst_pct);
    var snd_x = enclosing.f.x*snd_pct + enclosing.s.x*(1-snd_pct);
    var snd_y = enclosing.f.y*snd_pct + enclosing.s.y*(1-snd_pct);
    var fst = new Coord(fst_x, fst_y);
    var snd = new Coord(snd_x, snd_y);
    return new Endpoints(fst, snd, paddle.id);
}

var dist = function(c1, c2) {
    return Math.sqrt((c1.x-c2.x)**2 + (c1.y-c2.y)**2);
}

var drawBall = function(ctx, color, coord, nlive, nmax) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    var rad = c.BALL_RADIUS;
    ctx.arc(coord.x, coord.y, rad, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.restore();
}

var drawLine = function(ctx, color, c1, c2) {
    // draws a line from c1 to c2 in color
    ctx.save();
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(c2.x, c2.y);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}
    
var drawOverlay = function(ctx, place) {
    ctx.save();
    //ctx.font = what should it equal? mind sizes on mobile
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(225,225,225,100)'
    ctx.textAlign = 'center';
    ctx.fillText("you placed: " + place, 0, -7.5);
    ctx.fillText("press =g= or click/tap", 0, 0); // magic numbers...
    ctx.fillText("to play again", 0, 7.5);
    ctx.restore();
}

var drawWaiting = function(ctx) {
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    // i think that the above is unneccesary, but might as well be safe. Not like much is going on client-side
    ctx.fillStyle = 'rgba(225,225,225,100)';
    ctx.textAlign = 'center';
    ctx.fillText("waiting for", 0, -5);
    ctx.fillText("opponents...", 0, 5);
    ctx.restore();
}

var drawOver = function(ctx) {
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(225,225,225,100)'
    ctx.textAlign = 'center';
    ctx.fillText("press =g= or click/tap", 0, -5);
    ctx.fillText("to play again", 0, 5);
    ctx.restore();
}

var drawFail= function(ctx) {
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(225,225,225,100)'
    ctx.textAlign = 'center';
    ctx.fillText("connection error", 0, -5);
    ctx.fillText("try again perhaps", 0, 5);
    ctx.restore();
}

var drawBusy = function(ctx) {
    clearCanvas(ctx);
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    // i think that the above is unneccesary, but might as well be safe. Not like much is going on client-side
    ctx.fillStyle = 'rgba(225,225,225,100)';
    ctx.textAlign = 'center';
    ctx.fillText("server is too busy now", 0, -7.5);
    ctx.fillText("press =g= or click/tap", 0, 0); // magic numbers...
    ctx.fillText("to play again", 0, 7.5);
    ctx.restore();
}

var drawWin = function(ctx) {
    clearCanvas(ctx);
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(225,225,225,100)';
    ctx.textAlign = 'center';
    ctx.fillText("WINNER!", 0, -7.5);
    ctx.fillText("press =g= or click/tap", 0, 0); // magic numbers...
    ctx.fillText("to play again", 0, 7.5);
    ctx.restore();
}

var draw2nd = function(ctx) {
    clearCanvas(ctx);
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(225,225,225,100)';
    ctx.textAlign = 'center';
    ctx.fillText("second place!", 0, -7.5);
    ctx.fillText("press =g= or click/tap", 0, 0); // magic numbers...
    ctx.fillText("to play again", 0, 7.5);
    ctx.restore();    
}

var drawmsg = function(msg) {
    clearCanvas(ctx);
    ctx.save();
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.fillStyle = 'rgba(0,225,0,100)';
    ctx.textAlign = 'center';
    ctx.fillText(msg.toString(), 0, 0);
    ctx.restore();
}

var clearCanvas = function(ctx) {
    ctx.save();
    ctx.clearRect(-ctx.canvas.width, -ctx.canvas.height, ctx.canvas.width*2, ctx.canvas.height*2);
    ctx.restore();
}
