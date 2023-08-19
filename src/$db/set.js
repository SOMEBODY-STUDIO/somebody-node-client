module.exports = function set(key, value) {
	if (somebody.$db[key]) {
		return '[somebody.db] Error: $db key already exists.';
	}

	somebody.$db[key] = value;

	return {
		key : key,
		value : value
	};
}