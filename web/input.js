

// handles all input

var keystate = 'x'; // probably redundant? yeah
var input = 'x';

function keypressHandler(evt, isdn) {
    // "is down" (is a keydown)
    var thekey = 'x';
    // small but significant note: everything here is rotated by a half circle, so everything is upside-down
    if(evt.keyCode == '83') // 's'
	thekey = 'u';
    else if(evt.keyCode == '87') // 'w'
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
}


function touchHandler(evt) {
    // deals with touch events on the canvas, todo when I can get my hands on documentation lol
}




function keySender(ws) {
    if(keystate != 'x')
	ws.send(keystate);
}
