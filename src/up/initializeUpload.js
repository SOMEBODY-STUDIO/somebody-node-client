
module.exports = function initializeUpload(uploadID) {
	var upload = somebody.$db.get('up-uploads-' + uploadID);

	var to = upload.to || 'drive';

	if (to === 'account') {
		var api = 'accounts.files.insertFile';
		var params = {
			file : {
				name : upload.file.name,
				size : upload.file.size
			}
		};
	}

	if (to === 'drive') {
		var api = 'drive.objects.insertObject';
		var params = {
			locale : upload.locale,
			parentID : upload.parentID,
			objectType : upload.objectType,
			title : upload.file.name,
			filename : upload.file.name
		};
	}

	somebody.api.request({
		method : 'post',
		url : upload.api.url || somebody.config.api.url,
		api : api,
		projectID : upload.projectID || somebody.config.projectID,
		params : params,
		auth : upload.auth
	}, function(result) {
		if (result.error) {
			upload.status = 'error';
			upload.error = result.error;
			somebody.$db.del('up-uploads-' + upload.id);
			if (upload.onError) upload.onError(upload);
			return;
		}

		upload.status = 'initialized';

		if (to === 'account') {
			var account = result.data.account;
			upload.account = account;

			var file = result.data.file;

			upload.objectID = null;
			upload.url = file.url;
			upload.key = file.key;
			upload.ext = file.ext;
			upload.credentials = file.credentials;
		}

		if (to === 'drive') {
			var object = result.data;

			upload.objectID = object._id;
			upload.url = object.url;
			upload.key = object.key;
			upload.ext = object.ext;
			upload.credentials = object.credentials;
		}

		somebody.$db.set('up-uploads-' + upload.id, upload);

		upload.onInit(upload);

		return somebody.up.uploadFile(upload.id);
	});
}
