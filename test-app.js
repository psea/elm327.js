var obdServer = new OBDServer('http://localhost:9000/events');

function monitorCommand() {
    var command = document.getElementById("command").value;

    obdServer.addCommandListener(command, function(e) {console.log(e)});
}

function draw() {
    var ctx = document.getElementById('canvas').getContext('2d');

    function drawArc(a) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(150, 150, 50, Math.PI, Math.PI + a, false);
        ctx.stroke();
    }

    var time = 0;

    function update() {
        ctx.clearRect(0,0,300,300);
        drawArc(time);
        time += 0.01;
    }

    //setInterval(update, 100);
}

