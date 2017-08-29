


var httpClient = require('request');



exports.api = {
	request : function (request, callback) {

		var method = request.method || 'get';
		method = method.toLowerCase();
		var url = request.url || 'https://api.stellaverse.com';
		var api = request.api;
		var version = request.version || 1;
		var projectID = request.projectID || '000000000000';
		var auth = JSON.stringify(request.auth);

		var httpRequest = {
			method : method,
			headers : {
				'stella-api' : api,
				'stella-api-version' : version,
				'stella-project-id' : projectID,
				'stella-auth' : Buffer.from(auth,'utf8').toString('base64')
			},
			uri : url,
			qs : request.params,
			body : request,
			json : true
		};

		if (method === 'get') {
			httpRequest.uri = url + '/' + projectID + '/' + api.replace(/\./g,'-') + '/';
			delete httpRequest.body;
		}

		if (method === 'post') {
			delete httpRequest.qs;
		}

		httpClient(httpRequest, function(error, response, body) {

			if (error) {
				console.log(error);
				return callback({
					error : 'API Network Error'
				});
			}

			if (!body) {
				return callback({
					error : 'No Data Returned'
				});
			}

			return callback(body);

		});

	}
};
