const http = require('http');

module.exports.phishYears = [ '1983-1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000', '2002', '2003', '2004', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016','2017' ]


module.exports.getShow = function(date) {
    return new Promise(function(resolve, reject) {

       var options = {
           host: 'phish.in',
           path: '/api/v1/shows/' + date
       } 

       http.get(options, function(res){
            var showData = [];
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                showData.push(chunk);
            });
            res.on('end', function(){
                var resolveStr = JSON.parse(showData.join(''));
                resolve(resolveStr.data);
            });
       });
    });
}

module.exports.getEras = function() {
    return new Promise(function(resolve, reject){
        

        var options = {
            host: 'phish.in',
            path: '/api/v1/eras'
        }

        http.get(options, function(res) {
            var eras;
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                eras = JSON.parse(chunk);
            });
            res.on('end', function() {
                resolve(eras.data);
            });
        });
    })
}

module.exports.getYear = function(year) {
    return new Promise(function(resolve, reject){
        var options = {
            host: 'phish.in',
            path: '/api/v1/years/' + year
        }

        http.get(options, function(res) {
            var shows = [];
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                shows.push(chunk);
            });
            res.on('end', function() {
                var result = JSON.parse(shows.join(''));
                resolve(result.data);
            });
        });
    });
}