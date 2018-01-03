


module.exports = function get(key) {

	if (!stella.$db) {
		console.log('[stella.$db] Error: No such $db.');
		return undefined;
	}

	if (!stella.$db[key]) {
		console.log('[stella.$db] Error: $db key `' + key + '` not found.');
		return undefined;
	}

	return stella.$db[key];

}
