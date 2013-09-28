function OBDServer(url) {
    this.server = new EventSource(url);
    this.url = url;
}

OBDServer.prototype.addCommandListener = function (command, callback) {
    var oReq = new XMLHttpRequest();
    oReq.onload = function(e) {
        console.log(this.responseText);
    };
    oReq.open("GET", this.url.substr(0, this.url.length - 6) + command, true);
    oReq.send();

    this.server.addEventListener(command, 
        function(evt) {
            callback(evt.data)
        });
}

