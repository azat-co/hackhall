define([], function () { 
	return PostModel = Backbone.Model.extend({	
	url: '/api/posts',
	initialize: function (opt) {
		if (opt && !_.isObject(opt)) {
			this.url = "/api/posts/"+opt;
			this.id = opt;
			// console.log(this.url);
		}
		else {
			if (opt && opt.attributes && opt.attributes._id) {
				this.id = opt.attributes._id;
				this.url = '/api/posts/'+this.id;
			}
			// console.log(this.url);
		}

	}
});
});