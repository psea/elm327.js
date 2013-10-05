exports.ELM327 = ELM327;
var LoopedQueue = require("./lqueue").LoopedQueue;
var OBD = require('./pids-db');

/*
Represents command to the ELM327 adapter.
This object is intended for use in ELM327 polling queue.
Constructor takes command name and callback on response function
Callback function can use "this" to access useful information such as command and response.

rawCommand, processELMResponse are used in polling loop.

!fixme! elm AT and OBD command objects should has common prototype (superclass)
    removeEcho and removeResponseHeader should got to that common prototype
*/

/*
Returns response without echo and carriage return symbols.
    Elm327 can response with or without echo (see ATE0 ATE1 commands).
    Assume that we have echo.
    !fixme! any assumptions are bad. use echo to test response
*/
function removeEcho(str) {
   return str.replace(/\r+/g,'\r').split('\r')[1];
}

function ElmATCommand(cmd, callback) {
    var command = cmd.replace(/\s+/g,'');

    function processELMResponse(str) { 
        callback({value: removeEcho(str)});
    }
        
    this.rawCommand = command + '\r';
    this.processELMResponse = processELMResponse;
}

function ElmOBDCommand(cmd, callback) {
    var command = cmd.replace(/\s+/g,'');

    function processELMResponse(str) { 
        function removeResponseHeader(str) {
            return str.replace(/\s+/g, '').slice(command.length)
        }
        
        var elmResponse = removeResponseHeader(removeEcho(str));
        var OBDResponse = OBD.makeOBDResponse(command, parseFloat(elmResponse));
        callback(OBDResponse);
    }

    this.rawCommand = OBD.getOBDCommand(command) + '\r';
    this.processELMResponse = processELMResponse;
}

/* 
Represents adapter
we can:
    - add command to monitor by .monitorCommand(command, callback)
    - start polling loop by startMonitor
*/
function ELM327(device) {
    var serialport = require("serialport");
    var SerialPort = serialport.SerialPort;

    this.port = new SerialPort(device, {
        baudrate: 38400,
        databits: 8,
        stopbits: 1,
        parity: "none",
        parser: serialport.parsers.readline(">")
    });

    this.port.on("open", function() {console.log("Serial port " + device + " " + "opened")});
    this.queue = new LoopedQueue();
}

ELM327.prototype.monitorCommand = function(command, callback) {
    //!fixme! dispatch to AT and OBD command objects should be done by common prototype
    var isATCommand = command.replace(/\s+/g,'').substr(0,2).toUpperCase() === 'AT';

    if (isATCommand)
        this.queue.add(new ElmATCommand(command, callback));
    else
        this.queue.add(new ElmOBDCommand(command, callback));
}

/*
Starts infinite polling loop 
*/
ELM327.prototype.startMonitor = function() {
    //save port and queue in onData closure becouse "this" is not accesable when onData called
    var queue = this.queue;
    var port = this.port;

    // When data from port ready process it and send next request
    function onData(data) {
        queue.current.processELMResponse(data);
        var next = queue.next();
        //console.log(next.rawCommand);
        //console.log(data);
        port.write(next.rawCommand, null);  
    }

    if (!queue.isEmpty && port.listeners("data").length === 0) {
        port.on("data", onData);
        port.write(queue.current.rawCommand, null);
    }
}
