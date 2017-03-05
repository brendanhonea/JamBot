const Discord = require('discord.js');
const http = require('http');

const bot = new Discord.Client();
const token = 'Mjg3MDE2OTA1Nzg3NzAzMjk4.C5pJJA.JUph7Mqcm3Lndc0anNFnbIDWbr4';

const phishYears = [ '1983-1987','1988','1989','1990','1991','1992','1993','1994','1995','1996','1997','1998','1999','2000', '2002', '2003', '2004', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016','2017' ]

var Phishin = {}

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


bot.on('message', (message) => {
    if (message.content == '$eras'){
        Phishin.getEras().then(function(result){
            console.log(result);
            for (var x in result){
                message.channel.sendMessage(x + " Contains the years : " + result[x]);
            }
            message.channel.sendMessage("Which era would you like to listen to?");
        });
    }
    else if (message.content == '$1.0' || message.content == '$2.0' || message.content == '$3.0'){
        Phishin.getEras().then(function(result){
            eras = message.content;
            message.channel.sendMessage('Which year from ' + eras.substr(1) + ' would you like to listen to?');
            message.channel.sendMessage(result[eras.substr(1)]);
        });
    }
    else if (phishYears.indexOf((year = message.content.substr(1))) >= 0 ){
        Phishin.getYear(year).then(function(result){
            message.channel.sendMessage('The following shows were played in ' + year + ':');
            message.channel.sendMessage('');
            dates = [];
            for (var x in result){
                dates.push(result[x].date + '    id: ' + result[x].id);
            }
            datesStr = dates.join('\n');
            message.channel.sendMessage(datesStr);
            message.channel.sendMessage('You can view more info for a show by typing $<id>');
            message.channel.sendMessage('To play a show type $play <id>');
        });
    }

});



