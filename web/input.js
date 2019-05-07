

// handles all input

var keystate = 'x'; // probably redundant? yeah
var input = 'x';

function keypressHandler(evt, isdn) {
    // "is down" (is a keydown)
    var thekey = 'x';
    if(evt.keyCode == '87') // 'w'
	thekey = 'u';
    else if(evt.keyCode == '83') // 's'
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

function keySender(ws) {
    if(keystate != 'x')
	ws.send(keystate);
}
