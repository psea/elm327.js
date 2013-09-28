var obdServer = new OBDServer('http://localhost:9000/events');

function monitorCommand() {
    var command = document.getElementById("command").value;

    obdServer.addCommandListener(command, function(e) {console.log(e)});
}

