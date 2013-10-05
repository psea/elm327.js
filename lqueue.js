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
    var pos = 0;

    function isEmpty() { return (queue.length === 0) }

    function toNext() { pos = (pos + 1 >== queue.length) ? 0 : pos + 1 }

    function next() {
        toNext();
        return current();
    }

    function current() {return isEmpty() ? null : queue[pos]} 

    function add(obj) { queue.push(obj) }
 
    //Define interface
    Object.defineProperty(this, "current", {get: current});
    Object.defineProperty(this, "isEmpty", {get: isEmpty});
    this.add = add; 
    this.next = next;
}
