var uuid = require('node-uuid');



module.exports = function upload(upload) {
	upload.id = uuid.v4();
	upload.status = 'initializing';
	upload.date = {
		initiated : new Date().getTime(),
		completed : 0
	};

	if (!upload.auth) {
		upload.status = 'error';
		upload.error = 'You Must Login To Upload A File';
		console.error('[somebody.up] You must login to upload a file.');
		console.info(upload);
		upload.onError(upload);
		return;
	}

	somebody.$db.set('up-uploads-' + upload.id, upload);

	return somebody.up.initializeUpload(upload.id);
}