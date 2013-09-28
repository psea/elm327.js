exports.LoopedQueue = LoopedQueue;
exports.stringToCodes = stringToCodes;
exports.debugHeaders = debugHeaders;

/* 
Represents closed loop sequence.
We can: 
    - add objects to sequence by .add(obj)
    - move to the next object in sequence by .next()
    - return current object by .current()
*/
function LoopedQueue() {
    this.queue = [];
    this.pos = null;
}

LoopedQueue.prototype.add = function(data) {
    if (this.pos === null)
        this.pos = 0;

    this.queue.push(data);
}

LoopedQueue.prototype.next = function() {
    if (this.pos === null) return null;

    this.pos = (this.pos + 1 === this.queue.length) ? 0 : this.pos + 1;
    return this.queue[this.pos];
}

LoopedQueue.prototype.current = function() {
    if (this.pos === null) 
        return null;
    else 
        return this.queue[this.pos];
}

LoopedQueue.prototype.isEmpty = function() {
    return (this.queue.length === 0);
}

/*
Auxiliary functions
*/
function stringToCodes(s) {
    var codes = ""; 
    for (i = 0; i < s.length; i++)
        codes += s.charCodeAt(i) + " ";
    return codes;
}

function debugHeaders(req) {
    console.log('URL: ' + req.url);
    for (var key in req.headers) {
        console.log(key + ': ' + req.headers[key]);
    }
    console.log('\n\n');
}

