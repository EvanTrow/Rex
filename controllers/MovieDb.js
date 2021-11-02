const axios = require('axios'); // or ObjectID

const movieDbUri = process.env.MOVIEDB_URI;
const movieDbToken = process.env.MOVIEDB_TOKEN;

module.exports = function (e, db) {
	var module = {};

	module.getTrending = async (request, response, next) => {
		try {
			console.log(request.params, request.query, request.body);
			axios
				.get(`${movieDbUri}/trending/all/week?page=${request.query.page || 1}`, {
					headers: {
						Authorization: 'Bearer '.concat(movieDbToken),
						'Content-Type': 'application/json',
					},
				})
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
