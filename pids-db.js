exports.getOBDCommand = getOBDCommand;
exports.makeOBDResponse = makeOBDResponse;

//OBD PID definitions (ISO 15031-5)
var defs = [
    {
        command:"RPM",
        mode: "01",
        pid: "0C",
        desc: "Engine RPM",
        min: 0,
        max: 16383.75,
        units: "rpm",
        formula: function(x) { return x/4 }
    },
    {
        command:"ECT",
        mode: "01",
        pid: "05",
        desc: "Engine Coolant Temperature",
        min: -40,
        max: 215,
        units: "degC",
        formula: function(x) { return x - 40 }
    }   
    ];

function getOBDCommand(cmd) {
    var cmdObj =  defs.filter(function(obj) {return obj.command === cmd.toUpperCase()})[0];
    return cmdObj.mode + cmdObj.pid;
}

function getDefinition(cmd) {
    return defs.filter(function(obj) {return obj.command === cmd.toUpperCase()})[0];
}

function makeOBDResponse(cmd, value) {
    var def = getDefinition(cmd);

    // Yes, I know this looks ugly and I shouldn't repeat myself. !fixme!
    var res = {
        command: def.command,
        mode: def.mode,
        pid: def.pid,
        desc: def.desc,
        min: def.min,
        max: def.max,
        minUnits: def.formula(def.min),
        maxUnits: def.formula(def.max),
        units: def.units,
        value: def.formula(value)
    }
    return res;
}
