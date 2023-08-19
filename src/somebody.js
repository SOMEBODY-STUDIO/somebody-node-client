module.exports = {
	$db : {
		get : require('./$db/get.js'),
		set : require('./$db/set.js'),
		del : require('./$db/del.js')
	},
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