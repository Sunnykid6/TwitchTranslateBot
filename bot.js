const tmi = require('tmi.js');
const translate = require('@k3rn31p4nic/google-translate-api');
const spawn = require("child_process").spawn;
const fs = require('fs');

// Define configuration options
const opts = {
  identity: {
    username: '[Bot Account Username]',
    password: '[OAUTH Code from https://twitchapps.com/tmi/]'
  },
  channels: [
    '[Your Account Here]'
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {	
	if (self) { return; } // Ignore messages from the bot
	
	if(!isEmpty(context.emotes)){
		var emotesArray = Object.entries(context.emotes);
		console.log(emotesArray);
	}
	console.log(JSON.stringify(context));
	var str = msg.split(" ");
  // If the command is known, let's execute it
	if (str[0].toLowerCase() == '!translate'){
		if(!isEmpty(context.emotes)){
			var sentence = textTranslateHelper(str, 0);
			var translateTo = str[1];
			sentence = replaceEmotes(emotesArray, sentence).split(" ");
			sentence = textTranslateHelper(sentence, 2);
			console.log(sentence);
			var matches = sentence.match(/\<(.*?)\>/g);
			for(var i = 0; i < matches.length; i++){
				matches[i] = matches[i].replace(/[\<\>']+/g,'');
			}
			console.log(matches);
			translate(sentence, {to:translateTo}).then(res => {
				var result = res.text;
				console.log(result);
				for(var i = 0; i < matches.length; i++){
					result = result.replace(/\<(.*?)\>/ , "  " + matches[i] + "  ");
				}
				console.log(result);
				client.say(target, `${result}`);
			});
		}
		else{
			var sentence = textTranslateHelper(str, 2);
			var translateTo = str[1];
			translate(sentence, {to:translateTo}).then(res => {
				var result = res.text;
				console.log(result);
				client.say(target, `${result}`);
			});
		}
		
	}
	else if(str[0].toLowerCase() == '!languages'){
		var string0 = "[Common Languages] ";
		var string1 = "|English: en | Spanish: es | Russian: ru | Chinese: zh-CN | Korean: ko | ";
		var string2 = "Japanese: ja | Finnish: fi | French: fr | Vietnamese: vi | German: de |";
		var result = string0 + string1 + string2;
		client.say(target, `${result}`);
	}
	else if(str[0].toLowerCase() == '!example'){
		var string1 = "Copy Paste -> !translate en 안녕 잘 지내";
		client.say(target, `${string1}`);
	}
	else if(str[0].toLowerCase() == '!song'){
		string1 = getSongName();
		client.say(target, `${string1}`);

	}
	
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function textTranslateHelper(strArray, i){
    var translateText = "";
    for(i; i < strArray.length -1 ; i++){
	   translateText += strArray[i] + " ";
    }
    translateText += strArray[strArray.length - 1];
	return translateText;
}

function getEmoteName(emotesArray, msg){
	var emoteNameArray = [];
	for (var i = emotesArray.length - 1; i >= 0; i--) {
		// We're going through emotes in reverse so the indexes don't mess up

		var currentEmote = emotesArray[i][0];
		var currentEmoteIndexes = emotesArray[i][1][0].split("-");

		// Get the name of the emote using the indexes
		var emoteName = msg.substring(Number(currentEmoteIndexes[0]), Number(currentEmoteIndexes[1])+1);
		emoteNameArray.push(emoteName);
	}
	return emoteNameArray;
}

function replaceEmotes(emotesArray, msg){
	var indicesArray = createIndexArray(emotesArray);
	indicesArray = sortArray(indicesArray);
	for (var i = indicesArray.length - 1; i >= 0; i--) {
		var currentEmote = indicesArray[i][0];

		var emoteName = msg.substring(Number(indicesArray[i][1][0]), Number(indicesArray[i][1][1])+1);//.split('').join(' ');
		var thisEmoteReplacement = "<"+emoteName+">";

		msg = msg.substring(0, Number(indicesArray[i][1][0])) + thisEmoteReplacement + msg.substring(Number(indicesArray[i][1][1])+1);
		
	}
	return msg;
}	

function createIndexArray(emotesArray){
	var indicesArray = [];
	for (var i = emotesArray.length - 1; i >= 0; i--) {
		// We're going through emotes in reverse so the indexes don't mess up
		var currentEmote = emotesArray[i][0];

		for(var k = emotesArray[i][1].length - 1; k >=0; k--){	
			var duplicateEmoteIndexes = emotesArray[i][1][k].split("-");
			indicesArray.push([currentEmote, duplicateEmoteIndexes]);
		}
	}
	return indicesArray;
}

function sortArray(indicesArray){
	for(var i = 0; i < indicesArray.length; i++){
		for(var k = 0; k < indicesArray.length; k++){
			if(indicesArray[i][1] < indicesArray[k][1]){
				var temp = indicesArray[k];
				indicesArray[k] = indicesArray[i];
				indicesArray[i] = temp;	
			}
			else{
				continue;
			}
		}
	}
	return indicesArray;
}		

function getSongName(){
	var cp = require('child_process');
	const pythonProcess = cp.spawnSync('python', ["./getSong.py"]);
	var content = fs.readFileSync('SpotifyInfo.txt', 'utf8');
	if(content == "Spotify is closed"){
		content = fs.readFileSync('youtubeInfo.txt', 'utf8');
		if(content == ''){
			content = "No songs are currently playing";
		}
	}
	return content;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}