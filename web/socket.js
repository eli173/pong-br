
var prefixurl = "ws://localhost:6789"

var keystate = "";

function doIt() {
    console.log("aaa")
    var ws = new WebSocket(prefixurl);
    ws.onopen = function(event) {
	ws.send("Hello World!");
    };
    ws.onmessage = function(event) {
	console.log(event.data);
    }
}

function onload() {
    var timer = 0;
    document.getElementById("play").addEventListener('click',e=>doIt());
    document.getElementById("stop").addEventListener('click',e=>clearInterval(timer));
    console.log("ssss");

    var ws = new WebSocket(prefixurl);
    ws.onmessage = function(event) {
	console.log("event.data")
    }
    timer = window.setInterval(function(){sendInput(ws);},1000);
    window.onkeydown = (e=>keypressHandler(e,true));
    window.onkeyup = (e=>keypressHandler(e,false));
}

window.addEventListener("DOMContentLoaded",e=> onload());


function sendInput(ws) {
    if(keystate != '') {
	ws.send(keystate);
    }
}

function keypressHandler(evt,isdn) {
    if(evt.keyCode == '38') {
	if(isdn) {
	    keystate = 'u';
	}
	else if(keystate=='u') {
	    keystate = '';
	}
    }
    else if(evt.keyCode == '40') {
	if(isdn) {
	    keystate = 'd';
	}
	else if(keystate=='d') {
	    keystate = '';
	}
    }
}

function recievemessage(evt) {
    
    
}
