module.exports = function get(key) {
	if (!somebody.$db) {
		console.log('[somebody.$db] Error: No such $db.');
		return undefined;
	}

	if (!somebody.$db[key]) {
		console.log('[somebody.$db] Error: $db key `' + key + '` not found.');
		return undefined;
	}

	return somebody.$db[key];
}