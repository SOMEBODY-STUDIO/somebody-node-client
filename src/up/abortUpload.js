


module.exports = function abortUpload(uploadID) {

	var upload = stella.$db.get('up-uploads-' + uploadID);
	var uploader = stella.$db.get('up-uploaders-' + uploadID)

	uploader.abort();

	upload.status = 'aborted';

	upload.onAbort(upload);

	stella.$db.del('up-uploads-' + uploadID);
	stella.$db.del('up-uploaders-' + uploadID);

	return stella.up.finalizeUpload(upload);

}
