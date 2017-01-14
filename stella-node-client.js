


var httpRequest = require('request');



exports.api = {
	request : function (request, callback) {
		
		var url = request.url || 'https://api.stellaverse.com';
		
		httpRequest({
			method : 'post',
			uri : url,
			body : request,
			json : true
		}, function(error, response, body) {
			
			if (error) {
				console.log(error);
				return callback({
					error : 'API Network Error'
				});
			}
			
			if (response.statusCode !== 200) {
				return callback({
					error : 'An Error Occurred'
				});
			}
			
			if (!body) {
				return callback({
					error : 'No Result Returned'
				});
			}
			
			return callback(body);
			
		});
	
	}
};


