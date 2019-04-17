

function Player(ws) {
    this.status = 'x';
    this.socket = ws;
    this.socket.onmessage = this.listener;
}

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
    if(this.socket.readyState==1) { // TODO: replace the '1' with the proper identifier (the ready state constant)
	this.socket.send(data);
    }
}

Player.prototype.get_status = function() {
    var stat = this.status;
    this.status = 'x';
    return stat;
}


module.exports = Player;
