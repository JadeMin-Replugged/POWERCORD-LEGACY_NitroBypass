const { Plugin } = require("powercord/entities");
const { FluxDispatcher, getModule } = require("powercord/webpack");

const CONNECTION = new (require("./modules/CONNECTION.js"))();
const getCurrentUser = getModule(["getCurrentUser", "getUser", "_dispatchToken"], false).getCurrentUser;
/*const CONNECTION = {
	isAfterLogin: false,
	afterLogin: (callback=Function, ...args)=> {
		return FluxDispatcher.subscribe('CONNECTION_OPEN', function(){
			FluxDispatcher.unsubscribe('CONNECTION_OPEN', this);

			callback(...args);
		});
	}
};*/

let defaultPremium = null;
CONNECTION.afterLogin(function(){
	defaultPremium = getCurrentUser().premiumType;
});

module.exports = class NitroBypass extends Plugin {
	constructor(){ super(); }
	
	setPremiumType(type=Number){
		if(!CONNECTION.isConnected){
			CONNECTION.afterLogin(()=> {
				getCurrentUser().premiumType = type;
			});
		} else {
			getCurrentUser().premiumType = type;
		}
	}
	restorePremiumType(){
		getCurrentUser().premiumType = defaultPremium;
	}
	startPlugin(){
		this.setPremiumType(2);
	}
	pluginWillUnload(){
		this.restorePremiumType(true);
	}
}
