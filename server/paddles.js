
const DPADDLE = 0.1;


var Paddle = function(id) {
    // position is supposed to range between ±1
    this.id = id;
    this.position = 0;
}

Paddle.prototype.move(direction) {
    // direction is either 'u', 'd', or 'x', passed along from the inputs gathered elsewhere
    if((direction=='u') && (this.position < 1))
	this.position += DPADDLE;
    else if((direction=='d') && (this.position > -1))
	this.position -= DPADDLE;
}
