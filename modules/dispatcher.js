const { FluxDispatcher, getModule } = require("powercord/webpack");
const getCurrentUser = getModule(["getCurrentUser"], false).getCurrentUser;


let _isConnected = false;
class Dispatcher {
	constructor() {
		this.afterLogin(()=> _isConnected = true);
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



module.exports = {
	Dispatcher: new Dispatcher,
	FluxDispatcher: FluxDispatcher
};
