exports.LoopedQueue = LoopedQueue;

/* 
Represents closed loop sequence.
We can: 
    - add objects to sequence by .add(obj)
    - move to the next object in sequence by .next
    - return current object by .current
*/
function LoopedQueue() {
    var queue = [];
    var pos = null;

    function isEmpty() {return (queue.length === 0)}

    function next() {
        if (isEmpty()) return null;
        pos = (pos + 1 === queue.length) ? 0 : pos + 1;
        return queue[pos];
    }

    function current() {return isEmpty() ? null : queue[pos]}

    function add(obj) {
        if (isEmpty())
            pos = 0;
        queue.push(obj);
    };
 
    //Define interface
    Object.defineProperty(this, "next",    {get: next});
    Object.defineProperty(this, "current", {get: current});
    Object.defineProperty(this, "isEmpty", {get: isEmpty});
    this.add = add; 
}
