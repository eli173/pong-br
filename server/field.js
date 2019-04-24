
const RADIUS = 10; // completely arbitrary actually...

// for generating/using the actual playing field of the game, I guess it'll be newly generated on each frame? the math is simple enough...

var Endpoints = function(f,s,a) {
    // f,s are first, second coordinates, in increasing angle
    // a is alive
    // these endpoints enclose a paddle
    this.f = f;
    this.s = s;
    this.isAlive = a;
}

var Coord(x,y) {
    this.x = x;
    this.y = y;
}

var genEndpoints = function(n ,dead) {
    /**
       /* takes the number of players total (that the game started with, should be NUM_PLAYERS),
       /* and the array of the dead and dying
    */
    // so i'll start from a radius out a zero radians
    var endpoints = [];
    var players_length = n - dead.length;
    for(var d in dead) {
	players_length += d.time/DYING_TIME_IN_FRAMES;
    }
    var theta = 0;
    var dtheta = players_length/(2*Math.PI);
    var coord = new Coord(RADIUS,0);
    for(var i=0; i<n; i++) {
	var deadStatus = dead.find(e=>(e.id==i));
	if((deadStatus !== undefined) && (deadStatus.time > 0)) {
	    var r = RADIUS;
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var pt1 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var pt2 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    endpoints.append(new Endpoints(pt1, pt2, false));
	}
	else {
 	    theta += dtheta/2;
	    var pt1 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
 	    theta += dtheta/2;
	    var pt2 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    endpoints.append(new Endpoints(pt1, pt2, true));
	}
    }
    return endpoints;
}

var Field = function(endpoints, paddles)
