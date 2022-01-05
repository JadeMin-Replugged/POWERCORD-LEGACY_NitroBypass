const { FluxDispatcher, getModule } = require("powercord/webpack");
const getCurrentUser = getModule(["getCurrentUser"], false).getCurrentUser;


let _isConnected = false;
module.exports = class CONNECTION_MODULE {
	constructor() {
		this.afterLogin(()=> _isConnected = true);
	};
	
	isConnected() {
		return (getCurrentUser() !== undefined) || _isConnected;
	};
	afterLogin(callback=Function, ...args) {
		return FluxDispatcher.subscribe('CONNECTION_OPEN', function(){
			FluxDispatcher.unsubscribe('CONNECTION_OPEN', this);

			callback(...args);
		});
	};
};
