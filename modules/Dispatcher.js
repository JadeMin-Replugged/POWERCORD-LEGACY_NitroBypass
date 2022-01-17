const { FluxDispatcher, getModule } = require("powercord/webpack");
const { getCurrentUser } = getModule(["getCurrentUser", "getUser", "_dispatchToken"], false);


let _isConnected = false;
module.exports = class DISPATCHER {
	constructor() {
		this.afterLogin(()=> _isConnected = true);
		//this.Flux = { ...FluxDispatcher };
	};
	
	isConnected() {
		return (getCurrentUser() !== undefined) || _isConnected;
	};
	once(eventName, callback=Function, ...args) {
		const listener = function(){
			FluxDispatcher.unsubscribe(eventName, listener);
			
			callback(...args);
		};

		return FluxDispatcher.subscribe(eventName, listener);
	};
	afterLogin(callback=Function, ...args) {
		return this.once('CONNECTION_OPEN', ()=> callback(...args));
	};
};
