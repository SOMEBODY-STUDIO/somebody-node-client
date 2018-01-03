


module.exports = function finalizeUpload(uploadID) {

	var upload = stella.$db.get('up-uploads-' + uploadID);

	if (upload.to === 'account') {
		var api = 'accounts.files.finalizeUpload';
		var params = {
			fileURL : upload.url
		};
	}

	if (upload.to === 'project') {
		var api = 'drive.objects.finalizeObjectUpload';
		var params = {
			objectID : upload.objectID
		};
	}

	stella.api.request({
		url : upload.api.url || stella.config.api.url,
		method : 'post',
		api : api,
		params : params,
		auth : upload.auth
	}, function(result) {

		if (result.error) {

			upload.status = 'error';
			upload.error = result.error;

			stella.$db.set('up-uploads-' + upload.id, upload);

			return upload.onError(upload);

		}

		upload.status = 'complete';

		stella.$db.set('up.uploads.' + upload.id, upload);

		return upload.onComplete(upload);

	});

}
