




var Coord = function(x,y) {
    this.x = x;
    this.y = y;
}


Coord.prototype.dist2 = function(c2) {
    // returns square of the distance
    var dx = this.x-c2.x;
    var dy = this.y-c2.y;
    return dx*dx + dy*dy;
}

Coord.prototype.rotate = function(th) {
    // rotates about angle, returns new value
    var new_x = this.x*Math.cos(th) - this.y*Math.sin(th);
    var new_y = this.x*Math.sin(th) + this.y*Math.cos(th);
    this.x = new_x;
    this.y = new_y;
}
