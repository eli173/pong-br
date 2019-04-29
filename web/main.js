
var prefixurl = "ws://localhost:6789";

theSocket = null;


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
    ctx.transform(1, 0, 0, 1, ctx.width/2, ctx.height/2);

    
    theSocket = new WebSocket(prefixurl);
    theSocket.onmessage = function(e) {
	draw(JSON.parse(e.data), ctx);
    }
}


window.addEventListener("DOMContentLoaded", e => main());
