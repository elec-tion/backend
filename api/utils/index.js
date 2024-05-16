const fs = require("fs");
const path = require("path");
const pino = require("pino");

/**
 * Serializes an object recursively, converting BigInt values to Numbers.
 *
 * @param {object} obj - The object to be serialized.
 * @return {object} The serialized object with BigInt values converted to Numbers.
 */
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

const logDir = path.join(__dirname, "..", "logs");
const date = new Date();
const formattedDate = date.toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/:/g, '.').replace(/-/g, '.');
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}
const logger = pino(
	{},
	pino.transport({
		targets: [
			{
				level: "trace",
				target: "pino/file",
				options: {
					destination: path.join(logDir, `api.trace.${formattedDate}.log`),
				},
			},
			{
				level: "trace",
				target: "pino-pretty",
				options: {},
			},
		],
	})
);

module.exports = logger;
module.exports.serialize = serialize;