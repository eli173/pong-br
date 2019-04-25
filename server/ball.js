
const c = require('./constants.js');

const Coord = require('./coord.js');

function Ball() {
    // generates a new ball with random direction and speed (within limits)
    var coord = new Coord(0,0);
    var angle = Math.random()*2*Math.PI;
    var speed = Math.random()*(c.MAX_INIT-c.MIN_INIT) + c.MIN_INIT;
    this.dx = speed*Math.cos(angle);
    this.dy = speed*Math.sin(angle);
}

Ball.prototype.speed_up = function() {
    // this is ez with proportions
    var speed = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    if (speed > c.MAX_SPEED)
	speed = c.MAX_SPEED;
    this.dx = (speed*this.dx)/(speed+c.SPEED_BUMP);
    this.dy = (speed*this.dy)/(speed+c.SPEED_BUMP);
}

Ball.prototype.get_angle = function() {
    // gets angle from the origin
    return Math.atan2(this.coord.y, this.coord.x);
}
Ball.prototype.radius = c.BALL_RADIUS;

module.exports = Ball;
