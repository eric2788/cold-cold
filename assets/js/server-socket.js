let socket;
const socketUrl = "ws://localhost:5001/ws";

function socketConnect(){
    socket = new WebSocket(socketUrl, sessionManager.token.clientToken)
    socket.onopen = function(event) {
        console.log("opened connection to " + socketUrl);
    };
    socket.onclose = function(event) {
        console.log("closed connection from " + socketUrl);
    };
    socket.onmessage = function(event) {
        console.log(event.data);
    };
    socket.onerror = function(event) {
        console.log("error: " + event.data);
    };
}
