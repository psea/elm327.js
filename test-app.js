var obdServer = new OBDServer('http://localhost:9000/events');
var ctx;
var title;

function monitorCommand() {
    ctx = document.getElementById('canvas').getContext('2d');
    title = document.getElementById('indicatorTitle').textContent;
    var command = document.getElementById("command").value;

    //obdServer.addCommandListener(command, function(e) {console.log(e)});
    obdServer.addCommandListener(command, updateIndicator);
}

function drawArc(a) {
    ctx.clearRect(0,0,300,300);
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(150, 150, 50, Math.PI, Math.PI + a, false);
    ctx.stroke();
}

function updateIndicator(res) {
   console.log(res);
   title = res.desc + " " + res.units;
   var norm = (res.maxUnits - res.minUnits)/res.value;
   var a = norm*3.14;
   drawArc(a);
}

