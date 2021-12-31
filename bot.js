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
var twitchplaystate = false;
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
	//if you typed in !atp will go here
	//for different cases
	if(twitchplaystate){
		if(str[0].toLowerCase() == '!atp' && context.username == 'sunnykid'){
				twitchplaystate = false;
				console.log('Deactivated Twitch Plays')
		}
		else{
			switch(str[0].toLowerCase()){
				case 'up':
					if(str.length >= 2 && isNumeric(str[1])){
						//console.log(parseInt(str[1]));
						keyPress('up', parseInt(str[1]));
					}
					else{
						keyPress('up', 1);
					}
					break;
				case 'down':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('down', parseInt(str[1]));
					}
					else{
						keyPress('down', 1);
					}
					break;
				case 'left':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('left', parseInt(str[1]));
					}
					else{
						keyPress('left', 1);
					}
					break;
				case 'right':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('right', parseInt(str[1]));
					}
					else{
						keyPress('right', 1);
					}
					break;
				case 'a':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('a', parseInt(str[1]));
					}
					else{
						keyPress('a', 1);
					}
					break;
				case 'b':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('b', parseInt(str[1]));
					}
					else{
						keyPress('b', 1);
					}
					break;
				case 'select':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('select', parseInt(str[1]));
					}
					else{
						keyPress('select', 1);
					}
					break;
				case 'start':
					if(str.length >= 2 && isNumeric(str[1])){
						keyPress('start', parseInt(str[1]));
					}
					else{
						keyPress('start', 1);
					}
					break;				
			}
		}
	}
  // If the command is known, let's execute it
	else if (str[0].toLowerCase() == '!translate'){
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
		else{
			var sentence = textTranslateHelper(str, 2);
			var translateTo = str[1];
			translate(sentence, {to:translateTo}).then(res => {
				var result = res.text;
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
	else if(str[0].toLowerCase() == '!atp' && context.username == 'sunnykid'){
		twitchplaystate = true;
		console.log("Activated Twitch Plays");
	}
}

function isNumeric(val) {
    return /^-?\d+$/.test(val);
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
//probably more efficient way but this is to call the python code for key presses
function keyPress(input, bcount){
	const {childProcess} = require('child_process');
	switch(input){
		case 'up':
			let timestopress = bcount
			const keyup = spawn("python",
			    ["-c", `import keyUp; keyUp.press(${timestopress})`])
			break;
		case 'down':
			let timestopress1 = bcount
			const keydown = spawn("python",
			    ["-c", `import keyDown; keyDown.press(${timestopress1})`])
			break;			
		case 'left':
			let timestopress2 = bcount
			const keyleft = spawn("python",
			    ["-c", `import keyLeft; keyLeft.press(${timestopress2})`])
			break;
		case 'right':
			let timestopress3 = bcount
			const keyright = spawn("python",
			    ["-c", `import keyRight; keyRight.press(${timestopress3})`])
			break;
		case 'a':
			let timestopress4 = bcount
			const keya = spawn("python",
			    ["-c", `import keyA; keyA.press(${timestopress4})`])
			break;
		case 'b':
			let timestopress5 = bcount
			const keyb = spawn("python",
			    ["-c", `import keyB; keyB.press(${timestopress5})`])
			break;			
		case 'select':
			let timestopress6 = bcount
			const keyselect = spawn("python",
			    ["-c", `import keySelect; keySelect.press(${timestopress6})`])
			break;
		case 'start':
			let timestopress7 = bcount
			const keystart = spawn("python",
			    ["-c", `import keyStart; keyStart.press(${timestopress7})`])
			break;
	}

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