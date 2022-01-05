const { Plugin } = require("powercord/entities");
const { FluxDispatcher, getModule } = require("powercord/webpack");

const CONNECTION = new (require("./modules/CONNECTION.js"))();
const getCurrentUser = getModule(["getCurrentUser", "getUser", "_dispatchToken"], false).getCurrentUser;



const logging = false;
let defaultPremium = null;
CONNECTION.afterLogin(function(){
	defaultPremium = getCurrentUser().premiumType;
});

module.exports = class NitroBypass extends Plugin {
	constructor(){ super(); }
	
	setPremiumType(type=Number) {
		if(!CONNECTION.isConnected()) {
			CONNECTION.afterLogin(()=> {
				getCurrentUser().premiumType = type;
			});
		} else {
			getCurrentUser().premiumType = type;
		}
	}
	restorePremiumType() {
		getCurrentUser().premiumType = defaultPremium;
	}

	
	startPlugin() {
		if(logging) {
			this.check_isConnected = setInterval(function(){
				console.log(CONNECTION.isConnected());
			}, 1000);
		}
		this.setPremiumType(2);
	}
	pluginWillUnload() {
		if(logging) clearInterval(this.check_isConnected);
		this.restorePremiumType();
	}
};
