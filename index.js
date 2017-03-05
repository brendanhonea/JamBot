const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'Mjg3MDE2OTA1Nzg3NzAzMjk4.C5pJJA.JUph7Mqcm3Lndc0anNFnbIDWbr4';

bot.login(token);

bot.on('message', (message) => {
    if (message.content == 'ping'){
        message.reply('pong');
        message.channel.sendMessage("pong");
    }
});



var api = {}; 

api.getAllEras = function(){
    var http = require('http');
    
   
    var options = {
        host: 'phish.in',
        path: '/api/v1/eras/1.0'
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

api.getAllEras();