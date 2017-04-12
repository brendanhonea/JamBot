const Discord = require('discord.js');
const Phishin = require('./phish.js');

const bot = new Discord.Client();
const token = 'Mjg3MDE2OTA1Nzg3NzAzMjk4.C5pJJA.JUph7Mqcm3Lndc0anNFnbIDWbr4';

bot.login(token);

bot.on('message', function(message) {
    
    var messageWords = message.content.split(" ");

    //Initialize in voice channel
    if(messageWords[0] === '$join'){
        channel = bot.channels.find('name', messageWords[1]);
    }

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
    else if (Phishin.phishYears.indexOf((year = message.content.substr(1))) >= 0 ){
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
            
            var trackCount = 0;
            if (set1.length != 0){
                var setObj = getSetStr(set1, trackCount);
                trackCount += setObj.count;
                message.channel.sendMessage('Set 1: \n' + setObj.setStr);
            }
            if (set2.length != 0) {
                var setObj = getSetStr(set2, trackCount);
                trackCount += setObj.count;
                message.channel.sendMessage('Set 2: \n' + setObj.setStr);
            }
            if (set3.length != 0) {
                var setObj = getSetStr(set3, trackCount);
                trackCount += setObj.count;
                message.channel.sendMessage('Set 3: \n' + setObj.setStr);
            }
            if (encore.length != 0) {
                var setObj = getSetStr(encore, trackCount);
                trackCount += setObj.count;
                message.channel.sendMessage('Encore: \n' + setObj.setStr);
            }
            if (set4.length != 0) {
                var setObj = getSetStr(set4, trackCount);
                trackCount += setObj.count;
                message.channel.sendMessage('Set 4: \n' + setObj.setStr);
            }
        });
    }


    //Detailed show info
    else if (messageWords[0] === '$info') {
        
    }

    //Play through a show
    else if (messageWords[0] === '$play'){
        Phishin.getShow(messageWords[1]).then(function(result){
            channel = bot.channels.find('name', 'JamBot');

            channel.join(channel).then(function(connection){
                const playSong = function(tracknum) {
                    return new Promise(function(resolve, reject) {
                        const request = require('http');
                        const stream = result.tracks[tracknum].mp3;
                        request.get(stream, function(res){
                            const streamDispatcher = connection.playStream(res);
                            bot.on('message', (message) => {
                                var playerMessage = message.content.split(" ");

                                if (playerMessage[0] == '$skip'){
                                    streamDispatcher.end();
                                    resolve(tracknum + 1); //go to next track
                                }
                                if (playerMessage[0] == '$back'){
                                    streamDispatcher.end();
                                    resolve(tracknum - 1);
                                }
                                if (playerMessage[0] == '$track'){
                                    if (playerMessage[1] !== null 
                                    && playerMessage[1] < result.tracks.length 
                                    && playerMessage[1] > -1){
                                        streamDispatcher.end();
                                        resolve(playerMessage[1]);
                                    }
                                }
                                if (playerMessage[0] == '$stop'){
                                    streamDispatcher.end('stopped');
                                }
                            });
                            

                            streamDispatcher.on('end', function(reason){
                                if (reason != 'user'){ //If the track ends naturally
                                    console.log('track ' + tracknum + ' over');
                                    resolve(tracknum + 1);
                                }
                                if (reason == 'stopped'){
                                    resolve(-1);
                                }
                            });
                        });
                    })
                }
                
                //Start the player
                Player(0, i => (i < result.tracks.length && i > -1), playSong);
            });
        }).catch(rejectHandler);

    }
});

getSetStr = function(set, tracks) {
    var setStr = '';
    var count = 0;
    for (var i in set){
        setStr += (parseInt(i, 10) + parseInt(tracks, 10)) + ' -- ' + set[i].title + '\n';
        count++;
    }
    return {'setStr': setStr, 'count': count};
}

rejectHandler = function(reject){
    console.log(reject);
}

//Function to do async while loops (play through the playlist)
const Player = (data, condition, action) => {
    var whilst = (data) => {
  	    console.log(data);
        if (condition(data)){
            return action(data).then(whilst);
        }
        else {
            Promise.resolve(data);
        }

    }
    return whilst(data);
};