
var AWS = require('aws-sdk');



module.exports = function uploadFile(uploadID) {
	var upload = somebody.$db.get('up-uploads-'+ uploadID);

	var bucket = upload.bucket || 'cdn.somebody.studio';

	var credentials = new AWS.Credentials({
		accessKeyId : upload.credentials.AccessKeyId,
		secretAccessKey : upload.credentials.SecretAccessKey,
		sessionToken : upload.credentials.SessionToken
	});

	AWS.config.region = 'us-east-1';

	var s3 = new AWS.S3({
		credentials : credentials,
		maxRetries : 100,
		params : {
			Bucket : bucket
		}
	});

	somebody.$db.set('up-uploaders-' + upload.id, s3.upload({
		Key : upload.key,
		ACL : 'private',
		ContentType : upload.file.type,
		ContentLength : upload.file.size,
		Body : upload.file.buffer,
		ServerSideEncryption : 'AES256'
	}));

	somebody.$db.get('up-uploaders-' + upload.id).on('httpUploadProgress', function(event) {
		var total = event.total;
		var loaded = event.loaded;
		var percent = loaded / total * 100;

		var now = new Date().getTime();
		var started = upload.date.initiated;
		var elapsed = now - started;
		var rate = '0Mbps';
		var remaining = '0:00:00';

		upload.status = 'uploading';
		upload.loaded = loaded;
		upload.total = total;
		upload.percent = percent;
		upload.rate = rate;
		upload.remaining = remaining;

		somebody.$db.set('up-uploads-' + uploadID, upload);

		return upload.onProgress(upload);
	});

	somebody.$db.get('up-uploaders-' + upload.id).send(function(error, result) {
		if (error) {
			upload.status = 'error';
			upload.error = error;
			console.error('[somebody-node-client] Upload error, please try again.');
			console.error(error);
			somebody.$db.del('up-uploads-' + upload.id);
			somebody.$db.del('up-uploaders-' + upload.id);
			upload.onError(upload);
		} else {
			upload.status = 'uploaded';
		}

		somebody.$db.set('up-uploads-' + upload.id, upload);

		return somebody.up.finalizeUpload(upload.id);
	});
}
