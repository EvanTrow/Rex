const ngrok = require('ngrok');

(async function () {
	const url = await ngrok.connect({
		proto: 'http', // http|tcp|tls, defaults to http
		addr: 3000, // port or network address, defaults to 80
		// onStatusChange: (status) => {
		// 	console.log(status);
		// }, // 'closed' - connection is lost, 'connected' - reconnected
		// onLogEvent: (data) => {
		// 	console.log(data);
		// }, // returns stdout messages from ngrok process
	});

	const api = ngrok.getApi();
	const tunnels = await api.listTunnels();

	console.log('ngrok:', tunnels.tunnels[0].public_url);
})();
