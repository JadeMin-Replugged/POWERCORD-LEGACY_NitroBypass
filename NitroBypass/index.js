const { Plugin } = require("powercord/entities");
const { FluxDispatcher, getModule } = require("powercord/webpack");

const getCurrentUser = getModule(["getCurrentUser", "getUser", "_dispatchToken"], false).getCurrentUser;
let defaultPremium = null;
FluxDispatcher.subscribe('CONNECTION_OPEN', function(){
	FluxDispatcher.unsubscribe('CONNECTION_OPEN', this);
	
	defaultPremium = getCurrentUser().premiumType;
});


module.exports = class NitroBypass extends Plugin {
	constructor(){ super(); }
	
	setPremiumType(setDefault=Boolean, type=Number){
		if(getCurrentUser() === undefined){
			FluxDispatcher.subscribe('CONNECTION_OPEN', function(){
				FluxDispatcher.unsubscribe('CONNECTION_OPEN', this);
				
				return getCurrentUser().premiumType = setDefault? defaultPremium:type;
			});
		} else {
			return getCurrentUser().premiumType = type;
		}
	}
	startPlugin(){
		this.setPremiumType(false, 2);
	}
	pluginWillUnload(){
		this.setPremiumType(true);
	}
}