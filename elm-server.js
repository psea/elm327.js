var sys = require('sys');
var utils = require('./some_utils');
var elm = require('./elm327');

var adapter = new elm.ELM327('/dev/ttyUSB0');

function startServer (onMonitorRequest) {
    var Connect = require('connect'); 
    var CORS = require('connect-xcors');
    var sse = null;

    function processServerRequest(req, res) {

        function replyToSSEInit() {
            if (req.url == '/events') {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                });
                res.write("data: ELM server ready\n\n");
                sse = res;
                console.log("Client connected\n");
            } else {
                res.writeHead(404);
                res.end();
            }
        }

        function processMonitorRequest() {
            var command = req.url.substring(1);
            onMonitorRequest(command, sse);

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end("Command queued\n");
        }

//        utils.debugHeaders(req);
        if (req.headers.accept && req.headers.accept == 'text/event-stream')
            replyToSSEInit();
        else 
            processMonitorRequest();
    };


    var server = Connect.createServer(
        CORS({}),
        processServerRequest);
    server.listen(9000);
}

/*
Function called by the server supplying issued command and SSE stream to response
*/
function onMonitorRequest(command, sse) {
    var converter = getELMConverter(command);
    function onResponse(res) {
        var sseResponse = 
            "event: " + command + '\n' + 
            "data: " + converter.makeResponse(res.response) + "\n\n";
        sse.write(sseResponse);
        console.log(sseResponse);
    };
    adapter.monitorCommand(converter.elmCommand, onResponse);
    adapter.startMonitor();
}

function getELMConverter(command) {
    var converter;
    switch (command) {
        case "batteryVoltage":
            converter = {
                elmCommand: 'ATRV',
                makeResponse: function(res) {return parseFloat(res)}
            }
            break;
        default: 
            converter = {
                elmCommand: command,
                makeResponse: function(res) {return res}
            };
    }
    return converter;
}

startServer(onMonitorRequest);
