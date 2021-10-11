require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const admin = require('firebase-admin');
var serviceAccount = require('./plex-request-8ac22-firebase-adminsdk-dls3x-2146e489a1.json');

// add "ENV IS_DOCKER_CONTAINER yes" to docker file
var isDockerContainer = process.env.IS_DOCKER_CONTAINER || 'no';
if (isDockerContainer === 'yes') {
	var connection_string = process.env.MONGODB_PROD;
} else {
	var connection_string = process.env.MONGODB_DEV;
}

var api = express();
api.use(
	cors({
		origin: '*',
		optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	})
);

api.use(express.static(path.join(__dirname, '/build')));

// Body Parser Middleware
api.use(bodyParser.json());

//Setting up server and SQL Connection
(async function () {
	//
	// stuff

	// connect to MongoDB
	const { MongoClient } = require('mongodb');
	const client = new MongoClient(connection_string);
	await client.connect();
	const db = client.db('PlexRequest');

	// firebase client auth
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});

	start(db);
})();

api.use(decodeIDToken);
async function decodeIDToken(req, res, next) {
	try {
		if (req.path.startsWith('/api') && !req.path.startsWith('/api/registration') && !req.path.startsWith('/api/plex/media')) {
			if (typeof req.headers.authorization == 'undefined') {
				res.status(403).send({
					originalError: { message: 'You must be logged in!' },
				});
			} else {
				if (req.headers.authorization.startsWith('Bearer ')) {
					const idToken = req.headers.authorization.split('Bearer ')[1];

					try {
						const decodedToken = await admin.auth().verifyIdToken(idToken);
						req['currentUser'] = decodedToken;
					} catch (err) {
						res.status(403).send({
							originalError: { message: 'You must be logged in!' },
						});
					}
				}

				const user = req['currentUser'];
				if (!user) {
					res.status(403).send({
						originalError: { message: 'You must be logged in!' },
					});
				} else {
					next();
				}
			}
		} else {
			next();
		}
	} catch (error) {
		console.error(error.message);
		response.status(500).send(error);
	}
}

async function start(db) {
	var server = api.listen(process.env.PORT || 8080, function () {
		var port = server.address().port;
		console.log('App now running on port', port);
	});

	// Modular
	var Modular = require('./controllers/Modular')(null, db);
	api.get('/api/mod/:table/:action', Modular.get);
	api.post('/api/mod/:table/:action', Modular.post);

	// auth
	var Auth = require('./controllers/Auth')(null, db);
	api.post('/api/registration/user', Auth.updateUser);
	api.get('/api/user/:uid', Auth.getUser);

	// Plex
	var Plex = require('./controllers/Plex')(null, db);
	api.get('/api/plex/libraries', Plex.getLibraries);
	api.get('/api/plex/recent/:library', Plex.getRecent);
	api.get('/api/plex/media', Plex.getMedia);

	// // Config Controller
	// var Config_controller = require('./controllers/config')(null);
	// api.get('/config.js', Config_controller.generate);
	// api.get('/api/config', Config_controller.get);
	// api.post('/api/config', Config_controller.save);

	//
	//
	//
	//
	//
	//
	// Handles any requests that don't match the ones above
	api.get('*', async (req, res) => {
		try {
			res.sendFile(path.join(__dirname + '/build/index.html'));
			console;
		} catch (error) {
			console.error(error.message);
			response.status(500).send(error);
		}
	});
}
