
var prefixurl = "ws://localhost:6789"

theSocket = null;


function send(k, s) {
    // sends key k thru socket s
    theSocket.send(k);
}

function start() {
    // opens up a nice websocket
    theSocket = new WebSocket(prefixurl);
    theSocket.onmessage = function (e) {
	newdiv = document.createElement('div')
	newdiv.innerText = "data:" + e.data;
	document.getElementById('content').appendChild(newdiv);
    }
}



function onload() {
    document.getElementById("connect").addEventListener('click', e=> start());
    document.getElementById("up").addEventListener('click', e=> send('u',theSocket));
    document.getElementById("dn").addEventListener('click', e=> send('d',theSocket));
}
window.addEventListener("DOMContentLoaded", e => onload());
