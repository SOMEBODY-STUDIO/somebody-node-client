
module.exports = function finalizeUpload(uploadID) {
	var upload = somebody.$db.get('up-uploads-' + uploadID);

	if (upload.to === 'account') {
		var api = 'accounts.files.finalizeUpload';
		var params = {
			fileURL : upload.url
		};
	}

	if (upload.to === 'drive') {
		var api = 'drive.objects.finalizeObjectUpload';
		var params = {
			objectID : upload.objectID
		};
	}

	somebody.api.request({
		url : upload.api.url || somebody.config.api.url,
		method : 'post',
		api : api,
		projectID : upload.projectID || somebody.config.projectID,
		params : params,
		auth : upload.auth
	}, function(result) {
		if (result.error) {
			upload.status = 'error';
			upload.error = result.error;
			somebody.$db.del('up-uploads-' + upload.id);
			somebody.$db.del('up-uploaders-' + upload.id);

			return upload.onError(upload);
		}

		upload.status = 'complete';
		upload.object = result.data;

		somebody.$db.del('up-uploads-' + upload.id);
		somebody.$db.del('up-uploaders-' + upload.id);

		return upload.onComplete(upload);
	});
}
