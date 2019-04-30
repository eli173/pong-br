
// for generating/using the actual playing field of the game, I guess it'll be newly generated on each frame? the math is simple enough...


var genAllEndpoints = function(n, dead) {
    // gives everything relevant: endpoints enclosing walls, endpoints enclosing players
    // throw it all in the same array, sort it on demand. this might actually be better computationally
    var endpoints = [];
    var players_length = n -dead.length;
    for(var d of dead) {
	players_length += d.time/c.DYING_TIME_IN_FRAMES;
    }
    var theta = 0;
    var dtheta = (2*Math.PI)/players_length;
    var r = c.BOARD_RADIUS; // for brevity
    var multiplier = 1;
    for(var i=0;i<n;i++) {
	var deadOption = dead.find(d => (d.id==i));
	if(deadOption !== undefined) {
	    if(deadOption.time >0) {
		multiplier = (deadOption.time/c.DYING_TIME_IN_FRAMES)/2;
		var point1 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		theta += multiplier*dtheta;
		var point2 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		theta += multiplier*dtheta;
		var point3 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		endpoints.push(new Endpoints(point1, point2, i));
		endpoints.push(new Endpoints(point2, point3, -1));
	    }
	}
	else { // here it has to be alive, skips over dead and no time
		var point1 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		theta += dtheta;
		var point2 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		theta += dtheta;
		var point3 = new Coord(r*Math.cos(theta),r*Math.sin(theta));
		endpoints.push(new Endpoints(point1, point2, i));
		endpoints.push(new Endpoints(point2, point3, -1));
	}
    }
    return endpoints;
}


