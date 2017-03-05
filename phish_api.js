var api = {}; 

api.getEra = function(e){
    var http = require('http');
    
    var eras = ['1.0', '2.0', '3.0'];
    if (eras.indexOf(e) > -1){
        var options = {
            host: 'phish.in',
            path: '/api/v1/eras' + era
        }
    
        http.get(options, (res) => {
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                console.log('BODY: ' + chunk);
            });
            res.on('end', () => {
                console.log('No more data in respone');
            });
        });
    }
    else {
        throw "Not a valid era";
    }
    
}