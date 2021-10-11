const { ObjectId } = require('mongodb'); // or ObjectID

module.exports = function (e, db) {
	var module = {};

	module.get = async (request, response, next) => {
		try {
			var table = request.params.table || null;
			var action = request.params.action || null;

			var page = request.query.page || 0;
			var limit = Number(request.query.limit) || 100;

			var query = {};
			if (request.query.query) {
				try {
					query = JSON.parse(request.query.query);
					query = makeObjectID(query);
				} catch (e) {
					console.log(e);
				}
			}

			var joins = [];
			if (request.query.joins) {
				try {
					JSON.parse(request.query.joins).forEach((join) => {
						joins.push({
							...join,
						});
					});
				} catch (e) {
					console.log(e);
				}
			}

			console.log(query, joins);

			if (table && action) {
				const collection = db.collection(table); // initialize collection

				try {
					switch (action) {
						case 'get':
							collection.find(query).toArray(function (err, res) {
								if (err) {
									response.status(500).send('error');
								} else {
									response.send({ result: res });
								}
							});

							break;

						case 'join':
							collection
								.aggregate([
									{
										$facet: {
											result: [
												{
													$match: query,
												},

												...joins,

												{
													$skip: page * limit,
												},
												{
													$limit: limit,
												},
											],
											count: [
												{
													$group: {
														_id: null,
														count: { $sum: 1 },
													},
												},
											],
										},
									},
								])
								.toArray(function (err, res) {
									if (err) {
										console.log(err);
										response.status(500).send('error');
									} else {
										response.send(res[0]);
									}
								});
							break;

						default:
							response.status(500).send('error');
							break;
					}
				} catch (error) {
					response.status(500).send('error');
				}
			} else {
				response.status(500).send('error');
			}
		} catch (error) {
			console.log(error);
			response.status(500).send(error);
		}
	};

	module.post = async (request, response, next) => {
		try {
			var table = request.params.table || null;
			var action = request.params.action || null;

			// console.log(request.query);

			if (table && action) {
				const collection = db.collection(table); // initialize collection

				switch (action) {
					case 'update':
						var data = request.body.body;

						var id = data._id;
						delete data._id;
						delete data.join;

						data = makeObjectID(data);

						console.log({ _id: id });
						console.log({ $set: { ...data } });

						collection.updateOne({ _id: ObjectId(id) }, { $set: { ...data } }, function (err, res) {
							if (err) {
								response.status(500).send('error');
							} else {
								response.send({ result: res });
							}
							console.log('result', res);
							// response.send({ result: res });
						});
						break;
					case 'prefs':
						var data = request.body.body;

						collection.updateOne({ user: data.uid, page: data.page }, { $set: { ...data } }, { upsert: true }, function (err, res) {
							if (err) {
								response.status(500).send('error');
							} else {
								response.send({ result: res });
							}
							// console.log('result', res);
							// response.send({ result: res });
						});
						break;
					case 'create':
						var data = request.body.body;
						delete data.join;

						data = makeObjectID(data);

						collection
							.insert({ ...request.body.body })
							.then((doc) => {
								// console.log('result', doc);
								response.send({ result: doc });
							})
							.catch((e) => {
								console.log('error', e);
								response.send({ error: e });
							});

						break;
					case 'delete':
						collection
							.deleteMany({ _id: { $in: request.body.body.selected.map((id) => ObjectId(id)) } })
							.then((doc) => {
								// console.log('result', doc);
								response.send({ result: doc });
							})
							.catch((e) => {
								console.log('error', e);
								response.send({ error: e });
							});

						break;

					default:
						response.status(500).send('error');
						break;
				}
			} else {
				response.status(500).send('error');
			}
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
