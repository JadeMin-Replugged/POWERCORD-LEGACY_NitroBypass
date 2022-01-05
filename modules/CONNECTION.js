const { FluxDispatcher } = require("powercord/webpack");
let isConnected = false;

module.exports = class CONNECTION_MODULE {
	constructor() {
		this.afterLogin(()=> isConnected = true);
		
		this.isConnected = isConnected;
	};
	
	
	afterLogin(callback=Function, ...args){
		return FluxDispatcher.subscribe('CONNECTION_OPEN', function(){
			FluxDispatcher.unsubscribe('CONNECTION_OPEN', this);

			callback(...args);
		});
	};
};
