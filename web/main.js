
var prefixurl = "ws://localhost:6789";

theSocket = null;


var module = {};

var main = function() { // starts everything, gets us going, setup ish
    var canvas = document.getElementById('c');
    if(!canvas.getContext) {
	alert("Sorry, this game requires support for the <canvas> element");
	return;
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    // change the 1's to zoom in i think.. todo
    ctx.transform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2); // change to setTransform?

    // this is just to have everything go easily for testing
    var othersockets = [];
    for(var i=0; i<c.NUM_PLAYERS -1; i++) {
	othersockets.push(new WebSocket(prefixurl));
    }
    
    theSocket = new WebSocket(prefixurl);
    theSocket.onmessage = function(e) {
	draw(JSON.parse(e.data), ctx);
    }
}


window.addEventListener("DOMContentLoaded", e => main());
