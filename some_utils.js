exports.stringToCodes = stringToCodes;
exports.debugHeaders = debugHeaders;

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

