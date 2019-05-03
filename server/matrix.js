
const Vec = require('./coord.js');

var Matrix = function(a,b,c,d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
}

Matrix.prototype.inverse = function() {
    var recip = 1/(this.a*this.d-this.b*this.c);
    return new Matrix(this.d*recip, -this.b*recip, -this.c*recip, this.a*recip);
}

Matrix.prototype.mmul = function(m) {
    var a = this.a*m.a + this.b*m.c;
    var b = this.a*m.b + this.b*m.d;
    var c = this.c*m.a + this.d*m.c;
    var d = this.c*m.b + this.d*m.d;
    return new Matrix(a,b,c,d);
}
Matrix.prototype.vmul = function(v) {
    var x = this.a*v.x + this.b*v.y;
    var y = this.c*v.x + this.d*v.y;
    return new Vec(x,y);
}

module.exports= Matrix;
