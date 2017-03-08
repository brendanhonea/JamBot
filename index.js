const Discord = require('discord.js');
const http = require('http');

const bot = new Discord.Client();
const token = 'Mjg3MDE2OTA1Nzg3NzAzMjk4.C5pJJA.JUph7Mqcm3Lndc0anNFnbIDWbr4';

const phishYears = [ '1983-1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000', '2002', '2003', '2004', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016','2017' ]

var Phishin = {}

Phishin.getShow = function(date) {
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

Phishin.getEras = function() {
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

Phishin.getYear = function(year) {
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

bot.login(token);

bot.on('message', function(message) {
    
    var messageWords = message.content.split(" ");

    //Initialize in voice channel
    /*if(messageWords[0] === '$init'){
        channel = bot.channels.find('name', messageWords[1]);

        channel.join().then(function(connection){
            console.log('Connected');
        }).catch(rejectHandler);
    }*/

    //Showing years in all eras
    if (message.content == '$eras'){
        Phishin.getEras().then(function(result){
            for (var x in result){
                message.channel.sendMessage(x + " Contains the years : " + result[x]).catch(rejectHandler);
            }
            message.channel.sendMessage("Which era would you like to listen to?").catch(rejectHandler);
        });
    }


    //Showing years in an era
    else if (message.content == '$1.0' || message.content == '$2.0' || message.content == '$3.0'){
        Phishin.getEras().then(function(result){
            eras = message.content;
            message.channel.sendMessage('Which year from ' + eras.substr(1) + ' would you like to listen to?').catch(rejectHandler);
            message.channel.sendMessage(result[eras.substr(1)]).catch(rejectHandler);
        });
    }


    //Showing shows in a year
    else if (phishYears.indexOf((year = message.content.substr(1))) >= 0 ){
        Phishin.getYear(year).then(function(result){
            message.channel.sendMessage('The following shows were played in ' + year + ':').catch(rejectHandler);
            var dates = [];
            var venues = [];
            var showStr = '';

            for (var x in result){
                dates.push(result[x].date);
                venues.push(result[x].venue_name);
                var nextShow = dates[x] + ' ' + venues[x] + '\n';
                if (showStr.length + nextShow.length > 2000){
                    tmpStr = showStr;
                    if (tmpStr.length > 0){
                        message.channel.sendMessage(tmpStr);
                    }
                    
                    showStr = '';
                }
                showStr += nextShow;
            }
            
            
            if (showStr.length > 0) message.channel.sendMessage(showStr).catch(rejectHandler);
            message.channel.sendMessage('To view the setlist for a show type $setlist yyyy-mm-dd, for more info type $info yyyy-mm-dd').catch(rejectHandler);
            message.channel.sendMessage('To play a show type $play yyyy-mm-dd').catch(rejectHandler);
        }).catch(function(reject){
            console.log(reject);
        });
    }


    //Showing setlist info for a show
    else if (messageWords[0] === '$setlist'){
        Phishin.getShow(messageWords[1]).then(function(result){
            var set1 = [];
            var set2 = [];
            var set3 = [];
            var encore = [];
            var set4 = [];
            for (var i in result.tracks){
                //console.log(result.tracks[i].set.toLowerCase());
                switch (result.tracks[i].set){
                    case '1':
                        set1.push(result.tracks[i]);
                        break;
                    case '2':
                        set2.push(result.tracks[i]);
                        break;
                    case '3':
                        set3.push(result.tracks[i]);
                        break;
                    case 'E':
                        encore.push(result.tracks[i]);
                        break;
                    case '4':
                        set4.push(result.tracks[i]);
                        break;
                }
            }
                  
            if (set1.length != 0){
                message.channel.sendMessage('Set 1: \n' + getSetStr(set1));
            }
            if (set2.length != 0) {
                message.channel.sendMessage('Set 2: \n' + getSetStr(set2));
            }
            if (set3.length != 0) {
                message.channel.sendMessage('Set 3: \n' + getSetStr(set3));
            }
            if (encore.length != 0) {
                message.channel.sendMessage('Encore: \n' + getSetStr(encore));
            }
            if (set4.length != 0) {
                message.channel.sendMessage('Set 4: \n' + getSetStr(set4));
            }
        });
    }


    //Detailed show info
    else if (messageWords[0] === '$info') {
        
    }

    else if (messageWords[0] === '$play'){
        Phishin.getShow(messageWords[1]).then(function(result){
            
        }).catch(rejectHandler);

    }
});

getSetStr = function(set) {
    var setStr = '';
    for (var i in set){
        setStr += set[i].title + '\n';
    }
    return setStr;
}

rejectHandler = function(reject){
    console.log(reject);
}