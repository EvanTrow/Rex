const { ObjectId } = require('mongodb'); // or ObjectID

module.exports = function (e, db) {
	var module = {};

	module.updateUser = async (request, response, next) => {
		try {
			console.log(request.params, request.query, request.body);

			const data = request.body;

			const collection = db.collection('users'); // initialize collection
			collection.updateOne(
				{ uid: data.uid },
				{
					$set: {
						uid: data.uid,
						displayName: data.displayName,
						email: data.email,
						providerData: data.providerData,
					},
				},
				{ upsert: true },
				function (updateErr, updateRes) {
					if (updateErr) {
						response.status(500).send('error');
					} else {
						collection.find({ uid: data.uid }).toArray(function (findErr, findRes) {
							if (findErr) {
								response.status(500).send('error');
							} else {
								response.send(findRes[0]);
							}
						});
					}
				}
			);
		} catch (error) {
			console.log(error);
			response.status(500).send(error);
		}
	};

	module.getUser = async (request, response, next) => {
		try {
			console.log(request.params, request.query, request.body);

			const collection = db.collection('users'); // initialize collection
			collection.find({ uid: request.params.uid }).toArray(function (findErr, findRes) {
				if (findErr) {
					response.status(500).send('error');
				} else {
					response.send(findRes[0]);
				}
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
