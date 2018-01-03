


module.exports = function del(key) {

	if (!stella.$db) {
		console.log('[stella.$db] Error: No such $db.');
		return undefined;
	}

	if (!stella.$db[key]) {
		console.log('[stella.$db] Error: $db key `' + key + '` not found.');
		return undefined;
	}

	delete stella.$db[key];

	return true;

}
