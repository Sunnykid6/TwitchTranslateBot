const tmi = require('tmi.js');
const translate = require('@k3rn31p4nic/google-translate-api');

// Define configuration options
const opts = {
  identity: {
    username: 'sunnykidbot',
    password: 'oauth:5itqrqzpdi0aoykhfyjlsrxvicambg'
  },
  channels: [
    'sunnykid'
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
	}
	var str = msg.split(" ");
	// If the command is known, let's execute it
	if (str[0] === '!translate' || str[0] === '!Translate'){
		//If there are remove then insert after translation
		if(!isEmpty(context.emotes)){
			var sentence = textTranslateHelper(str, 0);
			var translateTo = str[1];
			sentence = replaceEmotes(emotesArray, sentence).split(" ");
			sentence = textTranslateHelper(sentence, 2);
			var matches = sentence.match(/\<(.*?)\>/g);
			for(var i = 0; i < matches.length; i++){
				matches[i] = matches[i].replace(/[\<\>']+/g,'');
			}
			translate(sentence, {to:translateTo}).then(res => {
				var result = res.text;
				for(var i = 0; i < matches.length; i++){
					result = result.replace(/\<(.*?)\>/ , "  " + matches[i] + "  ");
				}
				client.say(target, `${result}`);
			});
		}
		//If there are no emotes just translate
		else{
			var sentence = textTranslateHelper(str, 2);
			var translateTo = str[1];
			translate(sentence, {to:translateTo}).then(res => {
				var result = res.text;
				client.say(target, `${result}`);
			});
		}
		
	}
	else if(str[0] === '!languages' || str[0] === '!Languages'){
		var string0 = "[Common Languages] ";
		var string1 = "|English: en | Spanish: es | Russian: ru | Chinese: zh-CN | Korean: ko | ";
		var string2 = "Japanese: ja | Finnish: fi | French: fr | Vietnamese: vi | German: de |";
		var result = string0 + string1 + string2;
		client.say(target, `${result}`);
	}
	else if(str[0] === '!example' || str[0] === '!Example'){
		var string1 = "Copy Paste -> !translate en 안녕 잘 지내";
		client.say(target, `${string1}`);
	}
	
}
//checks to see if the object that stores emotes is empty
// made from the twitch api
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
//Stitches text back after a .split()
function textTranslateHelper(strArray, i){
    var translateText = "";
    for(i; i < strArray.length -1 ; i++){
	   translateText += strArray[i] + " ";
    }
    translateText += strArray[strArray.length - 1];
	return translateText;
}
//Swapping the emotes for a [emoteName] variant to swap later
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
//Creates a new array that contains emotesIDs and message location
//Made so that duplicate emotes are handled
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
//Sorts the new array that contains emoteIds and message location
//from least to greatest so replacing them doesn't affect ordering
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


// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}