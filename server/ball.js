
const c = require('./constants.js');

const Coord = require('./coord.js');

function Ball() {
    // generates a new ball with random direction and speed (within limits)
    this.coord = new Coord(0,0);
    var angle = Math.random()*2*Math.PI;
    var speed = Math.random()*(c.MAX_INIT-c.MIN_INIT) + c.MIN_INIT;
    this.dx = speed*Math.cos(angle);
    this.dy = speed*Math.sin(angle);
}

Ball.prototype.speed_up = function() {
    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    if (speed > c.MAX_SPEED)
	speed = c.MAX_SPEED;
    // fun trig stuff that i've messed up probably a few times now
    this.dx = this.dx*(speed+c.SPEED_BUMP)/speed;
    this.dy = this.dy*(speed+c.SPEED_BUMP)/speed;
}

Ball.prototype.get_angle = function() {
    // gets angle from the origin
    return Math.atan2(this.coord.y, this.coord.x);
}

Ball.prototype.reduce = function() {
    // returns a minimally necessary object for use on the client
    return this.coord;
}

Ball.prototype.radius = c.BALL_RADIUS;

module.exports = Ball;
