var { S3Client } = require('@aws-sdk/client-s3')
var { Credentials } = require('@aws-sdk/types')
var { Upload } = require('@aws-sdk/lib-storage')



module.exports = async function uploadFile(uploadID) {
	var upload = somebody.$db.get('up-uploads-' + uploadID);
	var bucket = upload.bucket || 'cdn.somebody.studio';

	try {
		var s3 = new S3Client({
			region : 'us-east-1',
			credentials : {
				accessKeyId : upload.credentials.AccessKeyId,
				secretAccessKey : upload.credentials.SecretAccessKey,
				sessionToken : upload.credentials.SessionToken
			},
			maxRetries : 1
		});

		var multipartUploader = new Upload({
			client : new S3Client({}),
			params : {
				Bucket : bucket,
				Key : upload.key,
				ACL : 'private',
				ContentType : upload.file.type,
				Body : upload.file.buffer,
				ServerSideEncryption : 'AES256'
			},
			queueSize : 4,
			partSize : 1024 * 1024 * 5,
			leavePartsOnError : false
		});

		somebody.$db.set('up-uploaders-' + upload.id, multipartUploader);

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

		var result = await somebody.$db.get('up-uploaders-' + upload.id).done();
		upload.status = 'uploaded';

		somebody.$db.set('up-uploads-' + upload.id, upload);

		return somebody.up.finalizeUpload(upload.id);
	} catch(error) {
		upload.status = 'error';
		upload.error = error;
		
		console.error('[somebody-node-client] Upload error, please try again.');
		console.error(error);

		somebody.$db.del('up-uploads-' + upload.id);
		somebody.$db.del('up-uploaders-' + upload.id);

		upload.onError(upload);

		somebody.$db.set('up-uploads-' + upload.id, upload);

		return somebody.up.finalizeUpload(upload.id);
	}
}
