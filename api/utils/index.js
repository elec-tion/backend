const serialize = (obj) => {
	const serialized = {};
	for (const key in obj) {
		if (obj[key] !== undefined) {
			const value = obj[key];
			if (typeof value === "bigint") {
				serialized[key] = Number(value.toString());
			} else if (typeof value === "object") {
				serialized[key] = serialize(value);
			} else {
				serialized[key] = value;
			}
		}
	}

	return serialized;
};


const pino = require('pino');


const logger = pino({
	

	
}, pino.transport({
	targets: [
		{
			level: "trace",
			target: "pino/file",
			options: {
				destination: "./logs/api.log",
			},
		},
		{
			level: "trace",
			target: "pino-pretty",
			options: {},
		},
	]
  }));



module.exports = {
	serialize,
};

module.exports = logger;

