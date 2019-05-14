
const prefixurl = "ws://" + window.location.hostname + ":6789";

var theSocket = null;

var is_dead = false;

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
    // i need to modify the 10's here to be appropriate given the scaling of the window
    ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2);
    ctx.lineWidth = ctx.lineWidth/5;

    
    // this is just to have everything go easily for testing, delete before final
    /**
    var othersockets = [];
    for(var i=0; i<c.NUM_PLAYERS -1; i++) {
	othersockets.push(new WebSocket(prefixurl));
    }
    /**/
    
    theSocket = new WebSocket(prefixurl);
    if(theSocket.readyState==theSocket.CLOSING || theSocket.readyState==theSocket.CLOSED) {
	// could not connect
	drawFail(ctx);
	return;
    }
    drawWaiting(ctx);
    
    theSocket.onmessage = function(e) {
	if(e.data == "busy") {
	    document.onclick = function(e) {location.reload()} // okay, outside of 'input' file...
	    document.onkeydown = function(e) {if(e.keyCode == '71') location.reload()};
	    drawBusy(ctx);
	    // socket should be closed by server
	    return;
	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	// change the 1's to zoom in i think.. todo
	ctx.setTransform(10, 0, 0, 10, ctx.canvas.width/2, ctx.canvas.height/2); // change to setTransform?
	ctx.lineWidth = ctx.lineWidth/5;
	if(e.data == "w") {
	    document.onclick = function(e) {location.reload()} // okay, outside of 'input' file...
	    document.onkeydown = function(e) {if(e.keyCode == '71') location.reload()};
	    drawWin(ctx);
	    console.log("winner");
	    return;
	}
	else if(e.data == "l") {
	    document.onclick = function(e) {location.reload()} // okay, outside of 'input' file...
	    document.onkeydown = function(e) {if(e.keyCode == '71') location.reload()};
	    draw2nd(ctx);
	    console.log("loser");
	    return;
	}
	var state = JSON.parse(e.data);
	
	if(!is_dead) {
	    // check for deadness

	    var status = state.dead.some(e => e.id == state.id);
	    if(status) {
		// add event listener if dead
		document.onclick = function(e) {location.reload()} // okay, outside of 'input' file...
		document.onkeydown = function(e) {if(e.keyCode == '71') location.reload()};
	    }
	}
	
	draw(state, ctx);
    }

    document.onkeydown = function(e) {keypressHandler(e, true);};
    document.onkeyup = function(e) {keypressHandler(e, false);};
    canvas.addEventListener('touchstart', function(e) {touchHandler(e, true);});
    canvas.addEventListener('touchend', function(e) {touchHandler(e, false);});
    var interval = setInterval(function(){keySender(theSocket);}, c.MS_PER_FRAME);

    theSocket.onclose = function(e) {clearInterval(interval)};
}

window.addEventListener("DOMContentLoaded", e => main());
