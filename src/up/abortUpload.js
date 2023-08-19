module.exports = function abortUpload(uploadID) {
	var upload = somebody.$db.get('up-uploads-' + uploadID);
	var uploader = somebody.$db.get('up-uploaders-' + uploadID)

	uploader.abort();

	upload.status = 'aborted';

	upload.onAbort(upload);

	somebody.$db.del('up-uploads-' + uploadID);
	somebody.$db.del('up-uploaders-' + uploadID);

	return somebody.up.finalizeUpload(upload);
}