

// handles all input

var keystate = 'x'; // probably redundant? yeah
var input = 'x';

function keypressHandler(evt, isdn) {
    // "is down" (is a keydown)
    var thekey = 'x';
    // small but significant note: everything here is rotated by a half circle, so everything is upside-down
    if(dnKey(evt.keyCode)) // 's'
	thekey = 'u';
    else if(upKey(evt.keyCode)) // 'w'
	thekey = 'd';
    
    if(!isdn && thekey==keystate) {
	keystate = 'x';
	input = 'x';
	return;
    }

    if(thekey == 'd' || thekey == 'u') {
	keystate = thekey;
	input = thekey;
    }
    keySender(keystate);
}

var upKey = function(kc) {
    // w, k, ↑
    return kc == '87' || kc == '75' || kc == '38';
}
var dnKey = function(kc) {
    // s, j, ↓
    return kc == '83' || kc == '74' || kc == '40';
}

function touchHandler(evt, isdn) {
    // deals with touch events on the canvas, todo when I can get my hands on documentation lol
    if(!isdn) {
	keystate = 'x';
	input = 'x';
    }
    var touchy = evt.touches[0].clientY; // should be guaranteed to be nonempty i think
    var cvheight = document.getElementById("c").clientHeight;
    if(touchy > cvheight/2) { // may need to swap these if i'm hastily misunderstanding coordinates
	keystate = 'u';
	input = 'u';
    }
    else {
	keystate = 'd';
	input = 'd';
    }
    keySender(keystate);
}




function keySender(ws) {
	ws.send(keystate);
}
