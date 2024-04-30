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

module.exports = {
	serialize,
};
