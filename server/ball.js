

const MIN_INIT = 3;
const MAX_INIT = 5; // initial speed constraints

const RADIUS = 0.5;

const MAX_SPEED = 15;

const SPEED_BUMP = 0.2;

const Coord = require('./coord.js');

function Ball() {
    // generates a new ball with random direction and speed (within limits)
    var coord = new Coord(0,0);
    var angle = Math.random()*2*Math.PI;
    var speed = Math.random()*(MAX_INIT-MIN_INIT) + MIN_INIT;
    this.dx = speed*Math.cos(angle);
    this.dy = speed*Math.sin(angle);
}

Ball.prototype.speed_up = function() {
    // this is ez with proportions
    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    if (speed > MAX_SPEED)
	speed = MAX_SPEED;
    this.dx = (speed*this.dx)/(speed+SPEED_BUMP);
    this.dy = (speed*this.dy)/(speed+SPEED_BUMP);
}

Ball.prototype.get_angle = function() {
    // gets angle from the origin
    return Math.atan2(this.coord.y, this.coord.x);
}
Ball.prototype.radius = RADIUS;

module.exports = Ball;
