


module.exports = function set(key, value) {

	if (stella.$db[key]) {
		return '[stella.db] Error: $db key already exists.';
	}

	stella.$db[key] = value;

	return {
		key : key,
		value : value
	};

}
