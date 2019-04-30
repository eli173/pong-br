

function Player(ws) {
    this.status = 'x';
    this.socket = ws;
    this.id = -1; // id just used for keeping track of deaths and whatnot
    var _this = this;
    var fn = function(msg) {
	_this.listener(msg);
    }
    this.socket.onmessage = fn;
}

// this should probably be renamed...
Player.prototype.listener = function(msg) {
    var data = msg.data;
    if(typeof data == "string" && data.length > 0) {
	if(data[0] == 'u')
	    this.status = 'u';
	else if(data[0] == 'd')
	    this.status = 'd';
	else
	    this.status = 'x';
    }
}

Player.prototype.send_data = function(data) {
    if(this.socket.readyState==this.socket.OPEN) {
	this.socket.send(data);
    }
}

Player.prototype.get_status = function() {
    var stat = this.status;
    this.status = 'x';
    return stat;
}


module.exports = Player;
