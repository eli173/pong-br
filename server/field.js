
const BOARD_RADIUS = 10; // completely arbitrary actually...

// for generating/using the actual playing field of the game, I guess it'll be newly generated on each frame? the math is simple enough...


const Coord = require('./coord.js')
const Endpoints = require('./endpoints.js')


var genEndpoints = function(n ,dead) {
    /**
       /* takes the number of players total (that the game started with, should be NUM_PLAYERS),
       /* and the array of the dead and dying
       /* does id's in a bad but expectable way
    */
    // so i'll start from a radius out a zero radians
    var endpoints = [];
    var players_length = n - dead.length;
    for(var d in dead) {
	players_length += d.time/DYING_TIME_IN_FRAMES;
    }
    var theta = 0;
    var dtheta = players_length/(2*Math.PI);
    var coord = new Coord(BOARD_RADIUS,0);
    for(var i=0; i<n; i++) {
	var deadStatus = dead.find(e=>(e.id==i));
	if((deadStatus !== undefined) && (deadStatus.time > 0)) {
	    var r = BOARD_RADIUS;
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var pt1 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var pt2 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    endpoints.push(new Endpoints(pt1, pt2, n));
	}
	else {
 	    theta += dtheta/2;
	    var pt1 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
 	    theta += dtheta/2;
	    var pt2 = new Coord(r*Math.cos(theta), r*Math.sin(theta));
	    endpoints.push(new Endpoints(pt1, pt2, n));
	}
    }
    return endpoints;
}

var endpointNegatives = function(endpoints) {
    // generates the opposite of genEndpoints
    // i.e. genEndpoints gives the spaces where the paddles live,
    // and this gives the endpoints enclosing walls
    var newpoints = [];
    newpoints.push(new Endpoints(endpoints[endpoints.length-1].s, endpoints[0].f,  -1));
    for(var i=1;i<endpoints.length;i++) {
	newpoints.push(new Endpoints(endpoints[i-1].s, endpoints[i].f, -1));
    }
    return newpoints;
}

var AnglePair = function(f,s,id) {
    this.f = f;
    this.s = s;
    this.id = id;
}
var angles = function(n, dead, thresh) {
    // gives angle pairs for the thresholds and whatnot.
    var angs = [];
    var players_length = n - dead.length;
    for(var d in dead) {
	players_length += d.time/DYING_TIME_IN_FRAMES;
    }
    var theta = 0;
    var dtheta = players_length/(2*Math.PI);
    var coord = new Coord(BOARD_RADIUS,0);
    for(var i=0; i<n; i++) {
	var deadStatus = dead.find(e=>(e.id==i));
	if((deadStatus !== undefined) && (deadStatus.time > 0)) {
	    var r = BOARD_RADIUS;
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var t1 = theta;
	    theta += (deadStatus.time/DYING_TIME_IN_FRAMES)/2;
	    var t2 = theta
	    angs.push(new AnglePair(t1, t2, n));
	}
	else {
 	    theta += dtheta/2;
	    var t1 = theta;
 	    theta += dtheta/2;
	    var t2 = theta;
	    angs.push(new anglepair(t1, t2, n));
	}
    }
    return angs;
}
