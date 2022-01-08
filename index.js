const { Plugin } = require("powercord/entities");
const { injector } = require("powercord/index.js");
const {
	FluxDispatcher, getModule,
	messages
} = require("powercord/webpack");
const { inject, uninject } = require('powercord/injector');

const CONNECTION = new (require("./modules/CONNECTION.js"))();
const getCurrentUser = getModule(["getCurrentUser", "getUser", "_dispatchToken"], false).getCurrentUser;



const logging = false;
let defaultPremium = null;
CONNECTION.afterLogin(()=> {
	defaultPremium = getCurrentUser().premiumType;
});

module.exports = class NitroBypass extends Plugin {
	constructor(){
		super();
		
		this.injectIDs = {
			sendMessage: 'NitroBypass-sendMessage',
			editMessage: 'NitroBypass-editMessage'
		};
	};
	
	setPremiumType(type=Number) {
		if(!CONNECTION.isConnected()) {
			CONNECTION.afterLogin(()=> {
				getCurrentUser().premiumType = type;
			});
		} else {
			getCurrentUser().premiumType = type;
		}
	};
	restorePremiumType() {
		getCurrentUser().premiumType = defaultPremium;
	};
	setEmojiBypass() {
		inject(this.injectIDs.sendMessage, messages, 'sendMessage', (args)=> {
			const [_channelId, message] = args;
		
			message.validNonShortcutEmojis.forEach(emoji=> {
				if(emoji.url.startsWith("/assets/")) return;
				const emojiName = emoji.allNamesString.replace(/~\d/g, "");
				const emojiFullDir = `<${emoji.animated? "a":''}${emojiName}${emoji.id}>`;
				
				message.content = message.content.replace(emojiFullDir, emoji.url+`&size=${48}`);
			});
		});
		inject(this.injectIDs.editMessage, messages, 'editMessage', (args)=> {
			const [_guildId, _channelId, message] = args;
			
			message.content.match(/<(a)?:(.*)?:\d{18}>/g).forEach(rawEmojiString=> {
				const emojiUrl = `https://cdn.discordapp.com/emojis/${rawEmojiString.match(/\d{18}/g)[0]}?size=${48}`;
				message.content = message.content.replace(rawEmojiString, emojiUrl);
			});
		});
	};
	restoreEmojiBypass() {
		Object.values(this.injectIDs).forEach(injectID=> {
			uninject(injectID);
		});
	};


	
	startPlugin() {
		if(logging) {
			this.check_isConnected = setInterval(function(){
				console.log(CONNECTION.isConnected());
			}, 1000);
		}


		this.setPremiumType(2);
		this.setEmojiBypass();
	};
	pluginWillUnload() {
		if(logging) clearInterval(this.check_isConnected);


		this.restorePremiumType();
		this.restoreEmojiBypass();
	};
};
