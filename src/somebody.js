
module.exports = {
	config : require('./config/config.js'),
	api : {
		request : require('./api/request.js')
	},
	up : {
		upload : require('./up/upload.js'),
		initializeUpload : require('./up/initializeUpload.js'),
		uploadFile : require('./up/uploadFile.js'),
		abortUpload : require('./up/abortUpload.js'),
		finalizeUpload : require('./up/finalizeUpload.js')
	}
}
