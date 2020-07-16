# TwitchTranslateBot June 18, 2020
A twitch bot that will translate text from users into any of the supported languages.
- Allows for any supported regular twitch emotes [DISCLAIMER] The bot will not have subs unless you sub so some emotes will just be text.
- Uses a Google Translate API so messages won't be super accurate. Hopefully just enough for you to understand the gist of your international audience
- Doesn't support FrankzerZ or BTTV emotes right now. Those emotes will get translated.
- Any other questions: Send me an email at sun.victor99@gmail.com


# Installations
- Create a new twitch account to act as your helper bot user. Take note of this Username
- Follow onlythe directions to install locally https://dev.twitch.tv/docs/irc (node and tmi package)
- Install https://openbase.io/js/@k3rn31p4nic/google-translate-api/documentation from your command line. Instructions on the page.
- Download this repository.
- Take note of the username that you want to bot to go to. [Make sure its your own because the bot will go to whatever channel you put]
- Next copy the OAUTH for your helper bot account from https://twitchapps.com/tmi/

# Setup
- Open up bot.js in your preferred edittor, I recommend notepad++ since its pretty simple and easy.
- At the top, there should be a section called **const ops**. Swap out what's inbetween the quotes for the following.
- Username = HelperBot account name 
- Password = OAUTH code from https://twitchapps.com/tmi/
- Channel = Your channel that you stream on or wherever you want the bot to go to
- Save and exit

# To Run
- Open up your command line and navigate to where you saved the file: use CD
- type **Node bot.js** 
- It should tell you **Connected to irc-ws.chat.twitch.tv:80** That means its successful. The bot should now be ready to go. You have to run this everytime you want the bot to be active.

# Commands
- !languages | shows you the code for common langauges used
- !example | an example on how to use the translate command
- !translate | how you actually translate the text that you want.
