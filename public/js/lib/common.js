var hostname, client;

var host = location.origin.replace(/^http/, 'ws')
var ws = new WebSocket(host);
//console.log(ws);
client   = new BinaryClient(host);

function fizzle(e) {
    e.preventDefault();
    e.stopPropagation();
    //console.log('This is fizzel');
}

function emit(event, data, file) {
    file       = file || {};
    data       = data || {};
    data.event = event;
    console.log(file,data, data.event);
    return client.send(file, data);
    
}

