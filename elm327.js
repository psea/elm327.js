exports.ELM327 = ELM327;
LoopedQueue = require("./lqueue").LoopedQueue;

/*
Represents command to the ELM327 adapter.
This object is intended for use in ELM327 polling queue.
Constructor takes command name and callback on response function
Callback function can use "this" to access useful information such as command and response.

elmCommand, processELMResponse are used in polling loop.
*/
function ELMCommand(cmd, callback) {
    this.command = cmd;
    this.rawCommand = cmd + '\r';
    this.onResponse = callback;
}

ELMCommand.prototype.processELMResponse = function (data) { 
    function removeEcho(str) {
        /*
        Returns response without echo and carriage return symbols.
            Elm327 can response with or without echo (see ATE0 ATE1 commands).
            Assume that we have echo.
            !fixme! any assumptions are bad. use echo to test response
        */
        return str.replace(/\r+/,'\r').split('\r')[1];
    }
    this.rawResponse = data;
    this.response = removeEcho(data);
    this.onResponse(this);
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
    this.queue.add(new ELMCommand(command, callback));
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
        var next = queue.next;
        port.write(next.rawCommand, null);  
    }

    if (!queue.isEmpty && port.listeners("data").length === 0) {
        port.on("data", onData);
        port.write(queue.current.rawCommand, null);
    }
}
