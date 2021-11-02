const axios = require('axios'); // or ObjectID

const plexUri = process.env.PLEX_URI;
const plextoken = process.env.PLEX_TOKEN;

module.exports = function (e, db) {
	var module = {};

	module.getLibraries = async (request, response, next) => {
		try {
			axios
				.get(`${plexUri}/library/sections?X-Plex-Token=${plextoken}`)
				.then((res) => {
					response.send(res.data);
				})
				.catch((err) => {
					console.log(err);
					response.status(500).send(err);
				});
		} catch (error) {
			console.log(error);
			response.status(500).send(error);
		}
	};

	// /hubs/home/recentlyAdded?type=1&sectionID=1&contentDirectoryID=1&X-Plex-Container-Start=0&X-Plex-Container-Size=12&X-Plex-Token=Napxg4_YG5ubmzPBaizM
	// /library/recentlyAdded?type=1&sectionID=1&contentDirectoryID=1&X-Plex-Container-Start=0&X-Plex-Container-Size=12&X-Plex-Token=Napxg4_YG5ubmzPBaizM

	module.getRecent = async (request, response, next) => {
		try {
			// console.log(request.params, request.query, request.body);

			axios
				.get(
					`${plexUri}/hubs/home/recentlyAdded?type=${request.params.library}&sectionID=${request.params.library}&contentDirectoryID=${request.params.library}&X-Plex-Container-Start=0&X-Plex-Container-Size=18&X-Plex-Token=${plextoken}`
				)
				.then((res) => {
					response.send(res.data);
				})
				.catch((err) => {
					console.log(err);
					response.status(500).send(err);
				});
		} catch (error) {
			console.log(error);
			response.status(500).send(error);
		}
	};

	module.getMedia = async (request, response, next) => {
		try {
			axios
				.get(`${plexUri}${request.query.url}?X-Plex-Token=${plextoken}`, {
					responseType: 'arraybuffer',
				})
				.then((res) => {
					const buffer = Buffer.from(res.data, 'binary'); // Ta-da
					response.writeHead(200, {
						'Content-Type': 'image/jpeg',
						'Content-Length': buffer.length,
					});
					response.end(buffer);
				})
				.catch((err) => {
					console.log(err);
					response.status(500).send(err);
				});
		} catch (error) {
			console.log(error);
			response.status(500).send(error);
		}
	};

	return module;
};

function makeObjectID(data) {
	for (const [key, value] of Object.entries(data)) {
		if (typeof value === 'object') {
			data[key] = makeObjectID(value);
		}

		if (key.endsWith('UID') || key.endsWith('_id')) {
			data[key] = ObjectId(value);
			console.log(`${key}: ${value}`);
		}
	}

	return data;
}
