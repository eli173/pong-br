

// contains the routines needed to actually get the stuff drawn

dwallcolor = 'rgb(200,0,0)';
wallcolor = 'rgb(100,100,0)';
pcolor = 'rgb(0,0,200)';
bcolor = 'rgb(100,100,100)';


// main function, given everything from the game state, draws on the given context
var draw = function(state, ctx) {
    clearCanvas(ctx);
    
    // okay, gotta get the endpoints, then draw the walls,
    // then draw the balls,
    // then finally the hard part is the paddles
    //console.log(state);

    var endpoints = genAllEndpoints(state.n, state.dead);
    console.log(endpoints);
    var livingzones = endpoints.filter(e => (e.id != -1) && (state.dead.some(d=>(d.id!=e.id))));
    var walls = endpoints.filter(e => (e.id==-1) || state.dead.some(d=>(d.id==e.id)));
    //draw walls
    for(var eps of walls) {
	var c = wallcolor;
	if(eps.id != -1) {
	    c = dwallcolor;
	}
	drawLine(ctx, c, eps.f, eps.s);
    }
    // balls
    for(var b of state.balls) {
	drawBall(ctx, bcolor, b);
    }
    // finally the paddles...
    for(var eps of livingzones) {
	var paddle = state.paddles.find(p => (p.id==ep.id)); //should be guaranteed?
	if(paddle === undefined) alert("UH OH, paddle somehow undefined");
	// cool this is way simpler since we know these are all alive
	var pps = getPaddlePoints(paddle, eps);
	drawLine(ctx, pcolor, pps.f, pps.s);
    }
}

var getPaddlePoints = function(paddle, enclosing) {
    // returns an endpoints object for the paddle
    // given the desired width of said paddle and the enclosing endpoints
    var encl_len = dist(enclosing.f, enclosing.s);
    var pspace_len = encl_len - (2*c.WIDTH_RATIO*encl_len);
    var place_on_pspace = pspace_len*(paddle.position+1)/2;
    var above_f = pspace_len + c.WIDTH_RATIO;  // distance above the first enclosing point (takes advantage of the increasing in angle thing to determine orientations)
    var overall_proportion = above_f/encl_len;
    var vector = [enclosing.s.x-enclosing.f.x, enclosing.s.y-enclosing.f.y];
    var d = overall_proportion-c.WIDTH_RATIO;
    var first = new Coord(vector[0]*d, vector[1]*d);
    d = overall_proportion+c.WIDTH_RATIO;
    var second = new Coord(vector[0]*d, vector[1]*d);
    return new Endpoints(first, second, paddle.id);
}

var dist = function(c1, c2) {
    return Math.sqrt((c1.x-c2.x)**2 + (c1.y-c2.y)**2);
}

var drawBall = function(ctx, color, coord) {
    ctx.save();
    ctx.fillStyle = bcolor;
    ctx.beginPath();
    ctx.arc(coord.x, coord.y, c.BALL_RADIUS, 0, 2*Math.PI, false);
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

var clearCanvas = function(ctx) {
    ctx.save();
    ctx.clearRect(-ctx.canvas.width, -ctx.canvas.height, ctx.canvas.width*2, ctx.canvas.height*2);
    ctx.restore();
}
